const AddedThread = require('../AddedThread');

describe('an AddedThread Entity', ()=>{
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: '123',
        };

        expect(()=>new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    });

    it('should throw error when payload did not meet data type specification',()=>{
        const payload = {
            title : 123, 
            owner :'123',
            id :'123',
        };

        expect(()=>new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});