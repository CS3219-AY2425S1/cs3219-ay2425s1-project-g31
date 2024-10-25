import React, { useEffect, useRef } from 'react'
import { loadEditor } from './lib/editor'

const CustomEditor = () => {
    const editorRef = useRef(null)

    useEffect(() => {
        const node = editorRef.current
        if (node) {
            loadEditor(node)
        }
    }, [])

    return <div id="editor" ref={editorRef}></div>
}

export default CustomEditor
