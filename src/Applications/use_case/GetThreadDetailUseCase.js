class GetThreadDetailUseCase{
    constructor({threadRepository, commentRepository}){
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository; 
    }

    async execute(useCasePayload){
        const threadData = await this._threadRepository.findThread(useCasePayload.thread_id);
        const commentData = await this._commentRepository.getThreadComments(useCasePayload.thread_id);

        threadData.comments = commentData.map((item)=>{
            return {
                id: item.id,
                username: item.username,
                date: item.date,
                content: (item.is_deleted)? '**komentar telah dihapus**' : item.content,
            };
        });;

        return threadData;
    }
}

module.exports = GetThreadDetailUseCase;