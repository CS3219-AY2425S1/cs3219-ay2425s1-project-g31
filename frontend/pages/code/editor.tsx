import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { useSession } from 'next-auth/react'
import { languages } from '@codemirror/language-data'
import { userColor } from '@/util/cursor-colors'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'
import { indentWithTab } from '@codemirror/commands'

const CodeMirrorEditor = forwardRef(({ roomId, language }: { roomId: string; language: string }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null)
    // eslint-disable-next-line no-unused-vars
    const [provider, setProvider] = useState<WebsocketProvider | null>(null)
    const [ydoc] = useState(() => new Y.Doc())
    const [ytext] = useState(() => ydoc.getText('codemirror'))
    const { data: session } = useSession()
    const [editorView, setEditorView] = useState<EditorView | null>(null)
    const compartment = useMemo(() => new Compartment(), [])

    useEffect(() => {
        if (!editorView) return
        ;(async () => {
            const languageExt = languages.find((lang) => lang.alias.includes(language) || lang.name === language)
            if (!languageExt) return
            const data = await languageExt.load()
            editorView.dispatch({
                effects: compartment.reconfigure(data),
            })
        })()
    }, [editorView, language])

    useImperativeHandle(
        ref,
        () => ({
            getText: () => ytext.toString(),
        }),
        [ytext]
    )

    useEffect(() => {
        if (!session) return
        const token = session.user.accessToken
        if (!token) return undefined
        const wsProvider = new WebsocketProvider(
            process.env.NEXT_PUBLIC_API_URL?.concat('/collab/y/ws') ?? 'ws://localhost:3008',
            roomId,
            ydoc,
            {
                protocols: [token],
            }
        )
        wsProvider.awareness.setLocalStateField('user', {
            name: session.user.username || 'Anonymous',
            color: userColor.color,
            colorLight: userColor.light,
        })
        if (wsProvider.ws) {
            wsProvider.ws.onclose = () => {}
        }
        setProvider(wsProvider)
        if (editorContainerRef.current) {
            const state = EditorState.create({
                doc: ytext.toString(),
                extensions: [
                    keymap.of([...yUndoManagerKeymap, indentWithTab]),
                    basicSetup,
                    oneDark,
                    compartment.of(javascript()),
                    yCollab(ytext, wsProvider.awareness),
                ],
            })
            const view = new EditorView({
                state,
                parent: editorContainerRef.current,
            })
            setEditorView(view)
            return () => {
                wsProvider.disconnect()
                view.destroy()
            }
        }
        return undefined
    }, [editorContainerRef, ydoc, ytext, session])

    return (
        <div
            ref={editorContainerRef}
            style={{
                height: '400px',
                overflow: 'scroll',
                border: '1px solid lightgray',
                backgroundColor: '#282c34',
            }}
        />
    )
})

export default CodeMirrorEditor
