const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const comments = require('../../../Interfaces/http/api/comments');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', ()=>{
    it('should orchestrating the get thread detail action correctly', async ()=>{
        const payload = {
            thread_id: 'thread-123'
        };

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.findThread = jest.fn().mockImplementation(()=>{
            return new GetThread({
                id: 'thread-123',
                title: 'thread 123',
                body: 'contect of thread 123',
                date: new Date('2024-10-26T00:00:00Z'),
                username: 'jono',
                comments: []
            });
        });

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getThreadComments = jest.fn().mockImplementation(()=>{
            return [new GetComment({
                id: 'comment-123',
                content: '123 comment',
                username: 'pokemon',
                date: new Date('2024-10-26T00:00:00Z'),
                is_deleted: true
            }),new GetComment({
                id: 'comment-231',
                content: '231 comment',
                username: 'digimon',
                date: new Date('2024-10-26T00:00:00Z'),
                is_deleted: false
            })];
        });

        const getThreadDetailUseCase = new GetThreadDetailUseCase({threadRepository:mockThreadRepository, commentRepository: mockCommentRepository});

        const result = await getThreadDetailUseCase.execute(payload);

        expect(result).toEqual(new GetThread({
            id: 'thread-123',
            title: 'thread 123',
            body: 'contect of thread 123',
            date: new Date('2024-10-26T00:00:00Z'),
            username: 'jono',
            comments: [{
                id: 'comment-123',
                username: 'pokemon',
                date: new Date('2024-10-26T00:00:00Z'),
                content: '**komentar telah dihapus**',
            }, {
                id: 'comment-231',
                username: 'digimon',
                date: new Date('2024-10-26T00:00:00Z'),
                content: '231 comment',
            }]
        }));

        expect(mockThreadRepository.findThread).toBeCalledWith(payload.thread_id);
        expect(mockCommentRepository.getThreadComments).toBeCalledWith(payload.thread_id);
    });
});