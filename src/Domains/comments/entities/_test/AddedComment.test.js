const AddedComment = require('../AddedComment');

describe('a AddedComment entity',()=>{
    it('should response 400 when did not meet property requirement', ()=>{
        const payload = {
            id:'123',
        };

        expect(()=>new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should response 400 when did not meet data type requirement', ()=>{
        const payload = {
            id:'comment-123',
            content: 6969,
            owner: 'user-123'
        };

        expect(()=>new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});