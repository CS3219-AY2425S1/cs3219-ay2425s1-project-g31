export interface IChat {
    senderId: string
    message: string
    createdAt: Date
}

export class ChatModel implements IChat {
    senderId: string
    message: string
    createdAt: Date
}
