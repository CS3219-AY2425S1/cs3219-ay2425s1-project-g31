import { EditorSelection, Extension, SelectionRange } from '@codemirror/state'
import { IPeerCollabConnection, IPeerConnection } from './IPeerCollabConnection'
import { PeerCollabOptions } from './PeerCollabTypes'
import { IPeerSelectionOptions } from './IPeerSelectionOptions'

export type PeerUser = {
    /**
     * Peer's remote username.
     */
    name: string
    /**
     * Hex color string representing the peer's remote cursor text color.
     */
    color: string
    /**
     * Hex color string representing the peer's remote cursor color.
     */
    bgColor: string
}

export type PeerSelectionRangeJSON = {
    main: number
    ranges: Pick<SelectionRange, 'anchor' | 'head'>[]
}

export type PeerEditorSelectionJSON = {
    version: number
    user: PeerUser
    selection: PeerSelectionRangeJSON | null
}

export type PeerEditorSelection = {
    clientID: string
    version: number
    user: PeerUser
    selection: EditorSelection
    _optimistic?: boolean
}

export type PeerSelectionRange = {
    clientID: string
    user: PeerUser
    range: SelectionRange
    isOptimistic?: boolean
}

type peerExtensionOptions =
    | { connection: IPeerCollabConnection; clientID: string; collab: PeerCollabOptions; selection?: null }
    | { connection: IPeerConnection; clientID: string; collab: PeerCollabOptions; selection: IPeerSelectionOptions }

export type peerExtensionFunc = (config: peerExtensionOptions) => Extension
