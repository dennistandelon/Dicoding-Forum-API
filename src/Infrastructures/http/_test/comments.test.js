const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe('/comments endpoints',()=>{
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads/{thread_id}/comments', ()=>{

        it('should response 401 when not authenticated', async ()=>{
            
            const payload = {
                content: '123',
            };

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
            });

            expect(response.statusCode).toEqual(401);
            
            const result = JSON.parse(response.payload);
            expect(result.error).toEqual('Unauthorized');
            expect(result.message).toEqual('Missing authentication');
        });

        if('should response 400 when not meet property requirement', async ()=>{
            const payload = {};

            const server = await createServer(container);

            const {token} = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            expect(response.statusCode).toEqual(400);
            
            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('fail');
            expect(result.message).toEqual('unable to post new comment due to uncomplete property');
        });
        
        if('should response 400 when not meet data type requirement', async ()=>{
            const payload = {
                content: 9.0
            };

            const server = await createServer(container);

            const {token} = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url:'/threads/thread-8810/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            expect(response.statusCode).toEqual(400);
            
            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('fail');
            expect(result.message).toEqual('unable to post new comment due to invalid data type');            
        });

        it('should response 404 when given invalid thread', async ()=>{
            const payload = {
                content: '1234567890',
            };

            const server = await createServer(container);
            const {token} = await ServerTestHelper.getCredential(server);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            expect(response.statusCode).toEqual(404);

            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('fail');
            expect(result.message).toEqual('Thread not found');
        });

        it('should response 201 when meet all requirement and persist comment data', async ()=>{
            const payload = {
                content: '1234567890',
            };

            const server = await createServer(container);
            const {token} = await ServerTestHelper.getCredential(server);

            await UsersTableTestHelper.addUser({id:'user-6969',username:'goodgame'});
            await ThreadsTableTestHelper.addThread({id:'thread-123',title:'apapun',owner:'user-6969'});

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: payload,
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            expect(response.statusCode).toEqual(201);

            const result = JSON.parse(response.payload);
            expect(result.status).toEqual('success');
            expect(result.message).toEqual('SUCCESS_ADDED_NEW_COMMENT');
            expect(result.data.addedComment).toBeDefined();
        });

    });
});