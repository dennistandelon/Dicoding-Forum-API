const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository{
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment){

        const {thread_id, content, owner} = newComment;
        const id = `comment-${this._idGenerator()}`
        const date = new Date().toISOString();
        const del = false;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content,owner',
            values: [id, owner, thread_id, content, del, date]
        }

        const result = await this._pool.query(query);

        return new AddedComment(result.rows[0]);
    }
}

module.exports = CommentRepositoryPostgres;