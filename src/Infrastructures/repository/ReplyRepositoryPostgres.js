const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const GetReply = require("../../Domains/replies/entities/GetReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository{
    constructor(pool, idGenerator){
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(newReply){
        const {comment_id, content, owner} = newReply;
        const id = `reply-${this._idGenerator()}`
        const date = new Date().toISOString();
        const del = false;

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content,owner',
            values: [id, owner, comment_id, content, del, date]
        }

        const result = await this._pool.query(query);

        return new AddedReply(result.rows[0]);
    }

    async softDeleteReply(id){
        const query = {
            text: 'UPDATE replies SET is_deleted=true WHERE id=$1',
            values: [id]
        };

        await this._pool.query(query);
    }

    async verifyReplyOwner(id, user){
        const query = {
            text: 'SELECT * FROM replies WHERE id=$1 AND owner=$2',
            values: [id, user]
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new AuthorizationError('Your are not the owner of this reply!');
        }
    }

    async verifyReplyStatus(reply_id, comment_id, thread_id){
        const query = {
            text: `SELECT replies.* FROM replies 
            JOIN comments ON comments.id = replies.comment_id   
            WHERE replies.id=$1 AND comments.id=$2 AND comments.thread_id=$3`,
            values: [reply_id, comment_id, thread_id]
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('Reply not found in this comment!');
        }
    }

    async getThreadReplies(thread_id){
        const query = {
            text: `SELECT replies.*, comments.thread_id, users.username FROM replies 
            JOIN comments ON comments.id = replies.comment_id   
            JOIN users ON replies.owner = users.id
            WHERE comments.thread_id=$1 
            ORDER BY replies.date ASC`,
            values: [thread_id]
        };

        const { rowCount, rows } = await this._pool.query(query);

        if (!rowCount) {
            return []
        }

        return rows.map((item)=> new GetReply({...item}));
    }
}

module.exports = ReplyRepositoryPostgres;