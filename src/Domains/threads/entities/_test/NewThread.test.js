const NewThread = require('../NewThread');

describe('an NewThread Entity', ()=>{
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: '123',
        };

        expect(()=>new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    });

    it('should throw error when payload did not meet data type specification', ()=>{
        const payload = {
            title : 123, 
            body :'123',
            owner: true
        };

        expect(()=>new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});