import { IPeerCollabConnection } from './IPeerCollabConnection'

export type PeerCollabOptions = {
    /**
     * The starting document version. Defaults to 0.
     */
    docStartVersion?: number
    /**
     * The debounce delay (in milliseconds) for pushing document updates to the authority.
     * Specify the time interval for collecting multiple updates before sending
     * them in a single request.
     */
    pushUpdateDelayMs?: number
}

export type PeerCollabConfigOptions = { connection: IPeerCollabConnection; clientID: string } & PeerCollabOptions
