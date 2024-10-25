import { PeerUser } from './PeerTypes'

export interface IPeerSelectionOptions {
    user: PeerUser
    /**
     * Number of milliseconds to show the username tooltip before hiding it.
     */
    tooltipHideDelayMs?: number
    /**
     * when `true`, it will send event to remove cursor when the editor loses focus.
     */
    removeOnEditorFocusOut?: boolean
}
