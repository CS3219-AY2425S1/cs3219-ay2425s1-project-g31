export interface CodeMirrorEditorProps {
    roomId: string
    language: string
}

export interface CodeMirrorEditorRef {
    getText: () => string
}
