const NewComment = require('../NewComment');

describe('a NewComment entity',()=>{
    it('should response 400 when did not meet property requirement', ()=>{
        const payload = {
            thread_id:'123',
        };

        expect(()=>new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    it('should response 400 when did not meet data type requirement', ()=>{
        const payload = {
            thread_id:'123',
            content: 6969,
            owner: 'user-123'
        };

        expect(()=>new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});