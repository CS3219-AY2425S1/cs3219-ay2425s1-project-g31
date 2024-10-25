import { Extension } from '@codemirror/state'
import { peerCollab } from './peer-collab'
import { peerExtensionFunc } from '@repo/collaboration-types'
import { peerSelection } from './peer-selection'

const peerExtension: peerExtensionFunc = ({ clientID, connection, collab, selection }) => {
    const extensions: Extension[] = []

    extensions.push(peerCollab(Object.assign({ connection, clientID }, collab)))

    if (selection) {
        extensions.push(
            peerSelection({
                ...selection,
                clientID,
                onBroadcastLocalSelection: connection.onBroadcastLocalSelection,
                onReceiveSelection: connection.onReceiveSelection,
            })
        )
    }

    return extensions
}

export default peerExtension
