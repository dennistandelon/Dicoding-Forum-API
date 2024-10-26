const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const GetComment = require('../../../Domains/comments/entities/GetComment');

describe('CommentRepository Postgres', ()=>{
    afterEach(async ()=>{
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('add comment function', ()=>{
        it('should persist new comment and return added comment correctly', async ()=>{
            
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            })

            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            const newComment = new NewComment({
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const commentResult = await commentRepository.addComment(newComment);

            expect(commentResult).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: '123',
                    owner: 'user-123'
                })
            );

            const expected = await CommentsTableTestHelper.findComment('comment-123');
            expect(expected).toHaveLength(1);  
        });

    });

    describe('verify comment function', ()=>{
        it('should throw error when not comment owner', async ()=>{

            const fakeGenerator = ()=>'123';

            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            expect(commentRepository.verifyCommentOwner('comment-123','user-123')).rejects.toThrowError('Your are not the owner of this comment!');
        });

        it('should throw error when comment not in thread', async ()=>{

            const fakeGenerator = ()=>'123';

            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            expect(commentRepository.verifyCommentThread('comment-123','thread-6969')).rejects.toThrowError('Comment not found in this thread!');
        });
    });

    describe('delete comment function', ()=>{
        it('should throw error when comment not found', async ()=>{
            const commentRepository = new CommentRepositoryPostgres(pool,{});

            expect(commentRepository.softDeleteComment('comment-1212')).rejects.toThrowError('Comment not found');       
        });

        it('should delete comment correctly', async ()=>{
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            })

            const fakeGenerator = ()=>'123';
            const commentRepository = new CommentRepositoryPostgres(pool,fakeGenerator);

            const newComment = new NewComment({
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const commentResult = await commentRepository.addComment(newComment);

            const finding1 = await CommentsTableTestHelper.findComment(commentResult.id);
            expect(finding1[0].is_deleted).toEqual(false);
            
            await commentRepository.softDeleteComment(commentResult.id);

            const finding2 = await CommentsTableTestHelper.findComment(commentResult.id);
            expect(finding2[0].is_deleted).toEqual(true);
        });
    });

    describe('get thread comments function',()=>{

        it('should return comments correctly', async()=>{

            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner, username:'apapun'});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            })

            const date = new Date('2024-10-26T00:00:00.000Z');
            const comment1 = {
                id: 'comment-123',
                content: '123 comment',
                owner: 'user-123',
                thread_id: thread_id,
                date: date
            };

            const comment2 = {
                id: 'comment-231',
                content: '231 comment',
                owner: 'user-123',
                thread_id: thread_id,
                date: date
            };

            await CommentsTableTestHelper.addComment(comment2);
            await CommentsTableTestHelper.addComment(comment1);

            const commentRepository = new CommentRepositoryPostgres(pool, {});
            const result = await commentRepository.getThreadComments(thread_id);

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(GetComment);
            expect(result[1]).toBeInstanceOf(GetComment);
        });
    });
});