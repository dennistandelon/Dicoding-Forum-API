const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");

class CommentsHandler{
    constructor(container){
        this._container = container;

        this.postAddCommentHandler = this.postAddCommentHandler.bind(this);
    }

    async postAddCommentHandler({params, payload, auth}, h){ 
        
        const useCasePayload = {
            thread_id: params.thread_id,
            content: payload.content,
            owner: auth.credentials.id
        };
        
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute(useCasePayload);
        
        const response = h.response({
            status: 'success',
            message: 'SUCCESS_ADDED_NEW_COMMENT',
            data: {
                addedComment,
            },
        });
        
        response.code(201)
        return response;
    }
}

module.exports = CommentsHandler;