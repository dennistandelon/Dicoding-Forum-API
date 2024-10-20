/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({id='comment-123', owner='user-123', thread_id='thread-123', content='123'}){
        const query = {
            text: 'INSERT INTO comments VALUES($1,$2,$3,$4)',
            values: [id, owner, thread_id, content],
        }

        await pool.query(query);
    },
    async findComment(id){
        const query = {
            text: 'SELECT * FROM comments WHERE id=$1',
            values: [id],
        }

        const result = await pool.query(query);

        return result.rows;
    },
    async softDeleteComment(id){
        const query = {
            text: 'UPDATE comments SET is_deleted=TRUE WHERE id=$1',
            values: [id],
        }

        await pool.query(query);
    },
    async cleanTable() {
      await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;