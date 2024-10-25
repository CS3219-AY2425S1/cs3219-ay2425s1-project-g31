import { PeerEditorSelectionJSON } from './PeerTypes'

export interface IPeerSelectionEvents {
    /**
     * Shares the local selection and cursor with other peers.
     * @param localSelectionData - The local selection data to be broadcasted.
     */
    onBroadcastLocalSelection: (clientID: string, localSelectionData: PeerEditorSelectionJSON) => void
    /**
     * Receives selection and cursor updates from peers.
     * @param onReceiveSelectionCallback - The callback function to handle received selection updates.
     */
    onReceiveSelection: (
        onReceiveSelectionCallback: (clientID: string, data: PeerEditorSelectionJSON | null) => void
    ) => void
}
