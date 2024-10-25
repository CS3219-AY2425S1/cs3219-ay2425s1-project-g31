import { Update } from '@codemirror/collab'

export type UpdateDocumentDTO = {
    version: number
    updates: Update[]
}
