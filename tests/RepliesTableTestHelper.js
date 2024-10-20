/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({id='reply-123', owner='user-123', comment_id='comment-123', content='123'}){
        const query = {
            text: 'INSERT INTO replies VALUES($1,$2,$3,$4)',
            values: [id, owner, comment_id, content],
        }

        await pool.query(query);
    },
    async findReply(id){
        const query = {
            text: 'SELECT * FROM replies WHERE id=$1',
            values: [id],
        }

        const result = await pool.query(query);

        return result.rows;
    },
    async softDeleteReply(id){
        const query = {
            text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1',
            values: [id],
        }

        await pool.query(query);
    },
    async cleanTable() {
      await pool.query('DELETE FROM replies WHERE 1=1');
    },
};

module.exports = RepliesTableTestHelper;