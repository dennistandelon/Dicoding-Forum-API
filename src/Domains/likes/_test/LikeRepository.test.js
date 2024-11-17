const LikeRepository = require('../LikeRepository');

describe('LikeRepository Interface', ()=>{
    it('should throw error when invoke abstract behaviour',()=>{
        const likeRepository = new LikeRepository();

        expect(likeRepository.getLike('','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(likeRepository.addLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(likeRepository.deleteLike('','')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        expect(likeRepository.getLikeCount('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});