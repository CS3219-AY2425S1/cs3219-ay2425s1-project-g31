import { WebSocketMessageType } from './WebSocketMessageType'

export interface WebSocketMessage<T> {
    type: WebSocketMessageType
    data: T
}
