import { IPeerSelectionEvents } from './IPeerSelectionEvents'
import { IPeerSelectionOptions } from './IPeerSelectionOptions'

export type PeerSelectionConfigOptions = IPeerSelectionOptions & IPeerSelectionEvents & { clientID: string }

export type PeerSelectionFullConfig = Required<PeerSelectionConfigOptions>
