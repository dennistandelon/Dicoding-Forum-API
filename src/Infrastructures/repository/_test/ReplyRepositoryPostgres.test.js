const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const GetReply = require("../../../Domains/replies/entities/GetReply");
const NewReply = require("../../../Domains/replies/entities/NewReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe('ReplyRepository Postgres', ()=>{
    afterEach(async ()=>{
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('add reply function', ()=>{
        it('should persist new reply and return added reply correctly', async ()=>{
            
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const fakeGenerator = ()=>'123';
            const replyRepository = new ReplyRepositoryPostgres(pool,fakeGenerator);

            const newReply = new NewReply({
                thread_id: 'thread-123',
                comment_id: 'comment-123',
                content: '123',
                owner: 'user-123'
            });

            const replyResult = await replyRepository.addReply(newReply);

            expect(replyResult).toStrictEqual(
                new AddedReply({
                    id: 'reply-123',
                    content: '123',
                    owner: 'user-123'
                })
            );

            const expected = await RepliesTableTestHelper.findReply('reply-123');
            expect(expected).toHaveLength(1);  
        });

    });

    describe('verify reply status function', ()=>{
        it('should throw error when reply not found', async ()=>{

            const fakeGenerator = ()=>'123';

            const replyRepository = new ReplyRepositoryPostgres(pool,fakeGenerator);

            await expect(replyRepository.verifyReplyStatus('reply-123','comment-1230')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw error when reply not found', async ()=>{

            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const fakeGenerator = ()=>'123';
            const replyRepository = new ReplyRepositoryPostgres(pool,fakeGenerator);

            await RepliesTableTestHelper.addReply({
                reply_id: 'reply-123',
                comment_id: 'comment-123',
                content: '123',
                owner: owner,
            });

            expect(replyRepository.verifyReplyStatus('reply-123','comment-123', 'thread-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('verify reply owner function', ()=>{
        it('should throw error when not reply owner', async ()=>{

            const fakeGenerator = ()=>'123';

            const replyRepository = new ReplyRepositoryPostgres(pool,fakeGenerator);

            await expect(replyRepository.verifyReplyOwner('reply-123','user-1230')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw error when is reply owner', async ()=>{

            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const fakeGenerator = ()=>'123';
            const replyRepository = new ReplyRepositoryPostgres(pool,fakeGenerator);

            await RepliesTableTestHelper.addReply({
                reply_id: 'reply-123',
                comment_id: 'comment-123',
                content: '123',
                owner: owner,
            });

            expect(replyRepository.verifyReplyOwner('reply-123','user-123')).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('delete reply function', ()=>{

        it('should delete reply correctly', async ()=>{
            const owner = 'user-123'
            await UsersTableTestHelper.addUser({id:owner});

            const thread_id = 'thread-123';
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                thread_id: thread_id,
                content: '123',
                owner: owner,
            });

            const fakeGenerator = ()=>'123';
            const replyRepository = new ReplyRepositoryPostgres(pool,fakeGenerator);

            const newReply = new NewReply({
                thread_id: 'thread-123',
                comment_id: 'comment-123',
                content: '123',
                owner: owner,
            });

            const replyResult = await replyRepository.addReply(newReply);

            const finding1 = await RepliesTableTestHelper.findReply(replyResult.id);
            expect(finding1[0].is_deleted).toEqual(false);
            
            await replyRepository.softDeleteReply(replyResult.id);

            const finding2 = await RepliesTableTestHelper.findReply(replyResult.id);
            expect(finding2[0].is_deleted).toEqual(true);
        });
    });

    describe('get thread replies function',()=>{

        it('should return empty replies correctly', async()=>{

            const owner = 'user-123'
            const thread_id = 'thread-123';
            const date = new Date('2024-10-26T00:00:00.000Z');
            
            await UsersTableTestHelper.addUser({id:owner, username:'apapun'});
            
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-231',
                content: '231 comment',
                owner: 'user-123',
                thread_id: thread_id,
                date: date
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: '123 comment',
                owner: 'user-123',
                thread_id: thread_id,
                date: date
            });


            const replyRepository = new ReplyRepositoryPostgres(pool, {});
            const result = await replyRepository.getThreadReplies(thread_id);

            expect(result).toHaveLength(0);
            expect(result).toStrictEqual([]);
        });

        it('should return replies correctly', async()=>{

            const owner = 'user-123'
            const thread_id = 'thread-123';
            const date = new Date('2024-10-26T00:00:00.000Z');
            
            await UsersTableTestHelper.addUser({id:owner, username:'apapun'});
            
            await ThreadsTableTestHelper.addThread({
                id: thread_id,
                title: '123',
                body: 'this is testing data',
                owner: owner,
            })

            await CommentsTableTestHelper.addComment({
                id: 'comment-231',
                content: '231 comment',
                owner: 'user-123',
                thread_id: thread_id,
                date: date
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: '123 comment',
                owner: 'user-123',
                thread_id: thread_id,
                date: date
            });

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                comment_id: 'comment-123',
                content: '123 comment',
                owner: 'user-123',
                date: new Date('2024-10-26T00:00:00.000Z')
            });

            await RepliesTableTestHelper.addReply({
                id: 'reply-1236',
                comment_id: 'comment-123',
                content: '1236 comment',
                owner: 'user-123',
                date: new Date('2024-10-27T00:00:00.000Z')
            });

            await RepliesTableTestHelper.addReply({
                id: 'reply-12223',
                comment_id: 'comment-231',
                content: '12223 comment',
                owner: 'user-123',
                date: new Date('2024-10-28T00:00:00.000Z')
            });

            const replyRepository = new ReplyRepositoryPostgres(pool, {});
            const result = await replyRepository.getThreadReplies(thread_id);

            expect(result).toHaveLength(3);
            expect(result).toStrictEqual([
                new GetReply({
                    id: 'reply-123',
                    comment_id: 'comment-123',
                    content: '123 comment',
                    username: 'apapun',
                    date: new Date('2024-10-26T00:00:00.000Z'),
                    is_deleted: false
                }),
                new GetReply({
                    id: 'reply-1236',
                    comment_id: 'comment-123',
                    content: '1236 comment',
                    username: 'apapun',
                    date: new Date('2024-10-27T00:00:00.000Z'),
                    is_deleted: false
                }),
                new GetReply({
                    id: 'reply-12223',
                    comment_id: 'comment-231',
                    content: '12223 comment',
                    username: 'apapun',
                    date: new Date('2024-10-28T00:00:00.000Z'),
                    is_deleted: false
                }),
            ]);
        });
    });
});