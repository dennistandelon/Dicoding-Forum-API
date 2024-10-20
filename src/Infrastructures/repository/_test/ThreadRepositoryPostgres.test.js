const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', ()=>{
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UserTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await pool.end();
    });

    describe('add thread function', ()=>{
        it('should persist new thread and return added thread correctly', async ()=>{

            const owner = 'user-123'
            await UserTableTestHelper.addUser({id:owner});

            const newThread = new NewThread({
                title: '123',
                body: 'this is testing data',
                owner: owner,
            });

            const fakeGenerator = ()=>'123';

            const threadRepository = new ThreadRepositoryPostgres(pool,fakeGenerator);

            const result = await threadRepository.addThread(newThread);
            expect(result).toStrictEqual(
                new AddedThread({
                    id: 'thread-123',
                    title: '123',
                    owner: 'user-123'
                })
            );

            const expected = await ThreadsTableTestHelper.findThread('thread-123');
            expect(expected).toHaveLength(1);  
        });
    });

    describe('verify thread function', ()=>{
        it('should throw error 404 when thread not found', async ()=>{

            const fakeGenerator = ()=>'123';

            const threadRepository = new ThreadRepositoryPostgres(pool,fakeGenerator);

            expect(threadRepository.verifyThread('thread-123')).rejects.toThrowError('Thread not found');
        });
    });

});