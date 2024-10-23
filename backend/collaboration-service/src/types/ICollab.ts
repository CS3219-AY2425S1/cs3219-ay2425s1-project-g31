export interface ICollab {
    user1Id: string
    user1Name: string
    user2Id: string
    user2Name: string
    matchId: string
    question: object
    code: object
    chat: object
    isCompleted?: boolean
    createdAt?: Date
}
