/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_deleted: {
            type: 'BOOLEAN',
            notNull: true,
            default: pgm.func('FALSE')
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint(
        'comments',
        'fk_comments.owner.id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

    pgm.addConstraint(
        'comments',
        'fk_comments.thread.id',
        'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('comments');
};
