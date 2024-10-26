import React, { useEffect, useMemo, useRef, useState } from 'react'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useRouter } from 'next/router'
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { useSession } from 'next-auth/react'
import { languages } from '@codemirror/language-data'

const usercolors = [
    { color: '#30bced', light: '#30bced33' },
    { color: '#6eeb83', light: '#6eeb8333' },
    { color: '#ffbc42', light: '#ffbc4233' },
    { color: '#ecd444', light: '#ecd44433' },
    { color: '#ee6352', light: '#ee635233' },
    { color: '#9ac2c9', light: '#9ac2c933' },
    { color: '#8acb88', light: '#8acb8833' },
    { color: '#1be7ff', light: '#1be7ff33' },
]
const userColor = usercolors[Math.floor(Math.random() * usercolors.length)]
interface CodeMirrorEditorProps {
    roomId: string
    language: string
}
const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({ roomId, language }) => {
    const editorContainerRef = useRef<HTMLDivElement>(null)
    // eslint-disable-next-line no-unused-vars
    const [provider, setProvider] = useState<WebsocketProvider | null>(null)
    const [ydoc] = useState(() => new Y.Doc())
    const [ytext] = useState(() => ydoc.getText('codemirror'))
    const { data: session, status } = useSession()
    const [editorView, setEditorView] = useState<EditorView | null>(null)
    const router = useRouter()
    const compartment = useMemo(() => new Compartment(), [])
    useEffect(() => {
        console.log('Change in language', language, editorView)
        if (!editorView) return
        ;(async () => {
            const languageExt = languages.find((lang) => lang.alias.includes(language) || lang.name === language)
            console.log('EXECUTING', languageExt)
            if (!languageExt) return
            const data = await languageExt?.load()
            console.log('New language data', data)
            editorView.dispatch({
                effects: compartment.reconfigure(data),
            })
        })()
    }, [language])

    useEffect(() => {
        if (!session) return
        const token = session.user.accessToken
        session?.user.id
        if (!token) return undefined
        const wsProvider = new WebsocketProvider('ws://localhost:3008', roomId, ydoc, {
            protocols: [token],
        })
        wsProvider.awareness.setLocalStateField('user', {
            name: session.user.username || 'Anonymous',
            color: userColor.color,
            colorLight: userColor.light,
        })
        if (wsProvider.ws) {
            wsProvider.ws.onclose = () => {
                console.log('GET THE FUCKOUT')
                // router.push('/');
            }
        }
        setProvider(wsProvider)
        // Initialize the editor only after the component is mounted
        if (editorContainerRef.current) {
            const state = EditorState.create({
                doc: ytext.toString(),
                extensions: [
                    keymap.of([...yUndoManagerKeymap]),
                    basicSetup,
                    //   python(),
                    compartment.of([]),
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
        <div ref={editorContainerRef} style={{ height: '400px', overflow: 'scroll', border: '1px solid lightgray' }} />
    )
}
export default CodeMirrorEditor
