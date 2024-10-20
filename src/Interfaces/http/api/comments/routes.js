const routes = (handler) => ([
    {
        method:'POST',
        path:'/threads/{thread_id}/comments',
        handler: handler.postAddCommentHandler,
        options: {
            auth: 'forumapi_jwt',
        },
    }
]);

module.exports = routes;