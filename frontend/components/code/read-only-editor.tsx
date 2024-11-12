import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useSession } from 'next-auth/react'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'
import { indentWithTab } from '@codemirror/commands'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface IProps {
    language: string
    code: string
}

const ReadOnlyCodeMirrorEditor = ({ language, code }: IProps) => {
    const editorContainerRef = useRef<HTMLDivElement>(null)
    // eslint-disable-next-line no-unused-vars
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

    useEffect(() => {
        if (!session) return
        const token = session.user.accessToken
        if (!token) return undefined
        if (editorContainerRef.current) {
            const state = EditorState.create({
                doc: code,
                extensions: [
                    keymap.of([indentWithTab]),
                    basicSetup,
                    oneDark,
                    compartment.of(javascript()),
                    EditorView.editable.of(false),
                ],
            })
            const view = new EditorView({
                state,
                parent: editorContainerRef.current,
            })
            setEditorView(view)
            return () => {
                view.destroy()
            }
        }
        return undefined
    }, [editorContainerRef, code])

    return (
        <ScrollArea className="h-80 rounded-b-xl bg-[#282c34]">
            <div ref={editorContainerRef} />
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

export default ReadOnlyCodeMirrorEditor
