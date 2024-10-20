const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

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
});