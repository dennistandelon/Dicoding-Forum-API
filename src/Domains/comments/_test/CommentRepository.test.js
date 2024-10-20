const CommentRepository = require('../CommentRepository');

describe('CommentRepository Interface', ()=>{
    it('should throw error when invoke abstract behaviour', async ()=>{
        const commentRepository = new CommentRepository();

        expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(commentRepository.findComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});