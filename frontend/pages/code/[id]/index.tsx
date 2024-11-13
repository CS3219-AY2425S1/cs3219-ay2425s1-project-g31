'use client'

import { ChatModel, ICollabDto, LanguageMode, getCodeMirrorLanguage } from '@repo/collaboration-types'
import { useEffect, useRef, useState } from 'react'

import CustomTabs from '@/components/customs/custom-tabs'
import Image from 'next/image'
import LanguageModeSelect from '../../../components/code/language-mode-select'
import React from 'react'
import TestcasesTab from '../../../components/code/testcase-tab'
import useProtectedRoute from '@/hooks/UseProtectedRoute'
import { useRouter } from 'next/router'
import CodeMirrorEditor from '../../../components/code/editor'
import { Complexity, IMatch } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import { getMatchDetails } from '@/services/matching-service-api'
import Chat from '../../../components/code/chat'
import io, { Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { ISubmission } from '@repo/submission-types'
import { mapLanguageToJudge0 } from '@/util/language-mapper'
import TestResult from '../../../components/code/test-result'
import { getChatHistory, getCollabHistory } from '@/services/collaboration-service-api'
import ReadOnlyCodeMirrorEditor from '../../../components/code/read-only-editor'
import { ResultModel } from '@repo/collaboration-types'
import { decodeStr } from '@/util/encryption'
import { TextSkeleton } from '@/components/customs/custom-loader'
import { CodeQuestion } from '../../../components/code/question'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CodeActions } from '@/components/code/actions'

export default function Code() {
    const router = useRouter()
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [id, setId] = useState(router.query.id as string)
    const editorRef = useRef<{ getText: () => string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [editorLanguage, setEditorLanguage] = useState<LanguageMode>(LanguageMode.Javascript)
    const testTabs = ['Testcases', 'Test Results']
    const [chatData, setChatData] = useState<ChatModel[]>([])
    const [activeTestTab, setActiveTestTab] = useState(0)
    const [matchData, setMatchData] = useState<IMatch>()
    const [collabData, setCollabData] = useState<ICollabDto>()
    const socketRef = useRef<Socket | null>(null)
    const [isOtherUserOnline, setIsOtherUserOnline] = useState(true)
    const [isCodeRunning, setIsCodeRunning] = useState(false)
    const [activeTest, setActiveTest] = useState(0)
    const [isViewOnly, setIsViewOnly] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [retry, setRetry] = useState(0)
    const [testResult, setTestResult] = useState<{ data: ResultModel | undefined; expectedOutput: string } | undefined>(
        undefined
    )

    useProtectedRoute()

    const retrieveMatchDetails = async (matchId: string) => {
        const response = await getMatchDetails(matchId).catch((err) => {
            if (retry >= 3) {
                router.push('/')
            } else {
                setRetry(retry + 1)
            }
        })
        if (response) {
            setMatchData(response)
            setIsViewOnly(response.isCompleted)
            if (response.isCompleted) {
                const collabResponse = await getCollabHistory(matchId)
                setEditorLanguage(collabResponse?.language ?? LanguageMode.Javascript)
                setCollabData(collabResponse)
            }
            setLoading(false)
        }
    }

    const { data: sessionData } = useSession()

    useEffect(() => {
        const encodedId = router.query.id as string
        const matchId = decodeStr(encodedId)
        retrieveMatchDetails(matchId)
        setId(matchId)
    }, [router.query.id, retry])

    useEffect(() => {
        if (isViewOnly) return

        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL ?? 'ws://localhost:3009', {
            path: process.env.NEXT_PUBLIC_API_URL ? '/api/collab/chat/ws/socket.io/' : '/socket.io',
            auth: {
                token: sessionData?.user.accessToken,
                name: sessionData?.user.username,
                roomId: id as string,
            },
        })

        socketRef.current.on('connect', async () => {
            if (socketRef.current) {
                socketRef.current.emit('joinRoom', { roomId: id })
                setChatData((await getChatHistory(id as string)) ?? [])
            }
        })

        socketRef.current.on('update-language', (language: string, showToast: boolean) => {
            setEditorLanguage(language as LanguageMode)
            if (showToast) {
                toast.success('Language mode updated')
            }
        })

        socketRef.current.on('executing-code', () => {
            setIsCodeRunning(true)
        })

        socketRef.current.on('code-executed', (res: ResultModel, expected_output: string) => {
            setTestResult({ data: res, expectedOutput: expected_output })
            setIsCodeRunning(false)
            setActiveTestTab(1)
        })

        socketRef.current.on('user-connected', (username: string) => {
            if (username !== sessionData?.user.username) {
                setIsOtherUserOnline(true)
            }
        })

        socketRef.current.on('user-disconnected', (username: string) => {
            if (username !== sessionData?.user.username) {
                setIsOtherUserOnline(false)
            }
        })

        socketRef.current.on('disconnect', () => {
            if (!isViewOnly) {
                router.push('/')
            }
        })

        socketRef.current.on('session-ended', () => {
            if (!isViewOnly) {
                router.push('/')
                toast.info('The session has ended')
            }
        })

        socketRef.current.on('receive_message', (data: ChatModel) => {
            setChatData((prev) => [...prev, data])
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [isViewOnly])

    const handleSendMessage = (message: string) => {
        if (message.trim()) {
            const msg: ChatModel = {
                message: message,
                senderId: sessionData?.user.username ?? '',
                createdAt: new Date(),
                roomId: id as string,
            }
            socketRef.current?.emit('send_message', msg)
        }
    }

    const handleLanguageModeSelect = (value: string) => {
        socketRef.current?.emit('change-language', value)
    }

    const handleRunTests = () => {
        if (!isCodeRunning) {
            const code = editorRef.current?.getText() ?? ''
            if (code.length === 0) {
                toast.error('Please write some code before running the tests')
                return
            }
            const data: ISubmission = {
                language_id: mapLanguageToJudge0(editorLanguage),
                source_code: code,
                expected_output: matchData?.question.testOutputs[activeTest] ?? '',
                stdin: '',
                testIndex: activeTest,
            }
            socketRef.current?.emit('run-code', data)
        }
    }

    const handleEndSession = () => {
        if (isViewOnly) {
            router.push('/sessions')
            return
        }

        if (socketRef.current) {
            setIsDialogOpen(true)
        }
    }

    function handleEndSessionConfirmation() {
        if (socketRef.current) {
            socketRef.current.emit('end-session')
        }
        setIsDialogOpen(false)
    }

    return (
        <div className="flex gap-3">
            <section className="w-1/3 flex flex-col h-fullscreen">
                <div className="flex items-center gap-4">
                    <Image src="/logo.svg" alt="Logo" width={28} height={28} className="my-2" />
                    <h2 className="text-lg font-medium">
                        Session with:{' '}
                        {loading ? (
                            <TextSkeleton />
                        ) : sessionData?.user.username !== matchData?.user1Name ? (
                            matchData?.user1Name
                        ) : (
                            matchData?.user2Name
                        )}
                    </h2>
                </div>
                <CodeQuestion
                    complexity={matchData?.question.complexity ?? Complexity.EASY}
                    loading={loading}
                    title={matchData?.question.title ?? ''}
                    description={matchData?.question.description ?? ''}
                    categories={matchData?.question.categories ?? []}
                />
                <Chat
                    isViewOnly={isViewOnly}
                    chatData={isViewOnly ? (collabData?.chatHistory ?? []) : chatData}
                    handleSendMessage={handleSendMessage}
                />
            </section>
            <section className="w-2/3 flex flex-col h-fullscreen">
                <CodeActions
                    isLoading={loading}
                    isViewOnly={isViewOnly}
                    username={matchData?.user1Id === sessionData?.user.id ? matchData?.user2Name : matchData?.user1Name}
                    isCodeRunning={isCodeRunning}
                    handleRunTests={handleRunTests}
                    isOtherUserOnline={isOtherUserOnline}
                    handleEndSession={handleEndSession}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    handleEndSessionConfirmation={handleEndSessionConfirmation}
                />
                <div id="editor-container" className="mt-4">
                    <div id="language-mode-select" className="rounded-t-xl bg-neutral-800">
                        <LanguageModeSelect
                            displayValue={editorLanguage}
                            setDisplayValue={setEditorLanguage}
                            onSelectChange={handleLanguageModeSelect}
                            isViewOnly={isViewOnly}
                            className="w-max text-white bg-neutral-800 rounded-tl-lg"
                        />
                    </div>
                    {isViewOnly ? (
                        <ReadOnlyCodeMirrorEditor
                            language={getCodeMirrorLanguage(editorLanguage)}
                            code={collabData?.code ?? ''}
                        />
                    ) : (
                        <CodeMirrorEditor
                            ref={editorRef}
                            roomId={id as string}
                            language={getCodeMirrorLanguage(editorLanguage)}
                        />
                    )}
                </div>
                <CustomTabs
                    tabs={testTabs}
                    activeTab={activeTestTab}
                    setActiveTab={setActiveTestTab}
                    className="mt-4 border-2 rounded-t-lg border-slate-100"
                />
                <ScrollArea
                    id="test-results-container"
                    className="border-2 rounded-lg border-t-0 rounded-t-none border-slate-100 flex-grow"
                >
                    <div className="m-4 flex overflow-x-auto">
                        {activeTestTab === 0 ? (
                            <TestcasesTab
                                isLoading={loading}
                                activeTestcaseIdx={activeTest}
                                setActiveTestcaseIdx={setActiveTest}
                                testInputs={matchData?.question.testInputs ?? []}
                                testOutputs={matchData?.question.testOutputs ?? []}
                            />
                        ) : (
                            <TestResult
                                isLoading={isCodeRunning}
                                result={isViewOnly ? collabData?.executionResult : testResult?.data}
                                expectedOutput={
                                    isViewOnly
                                        ? (matchData?.question.testOutputs[
                                              collabData?.executionResult?.testIndex ?? 0
                                          ] ?? '')
                                        : (testResult?.expectedOutput ?? '')
                                }
                            />
                        )}
                    </div>
                </ScrollArea>
            </section>
        </div>
    )
}
