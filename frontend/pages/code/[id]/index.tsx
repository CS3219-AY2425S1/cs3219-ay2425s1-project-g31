import { EndIcon, PlayIcon } from '@/assets/icons'
import { ICollabDto, LanguageMode, getCodeMirrorLanguage } from '@repo/collaboration-types'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import CustomLabel from '@/components/ui/label'
import CustomTabs from '@/components/customs/custom-tabs'
import { DifficultyLabel } from '@/components/customs/difficulty-label'
import Image from 'next/image'
import LanguageModeSelect from '../language-mode-select'
import React from 'react'
import TestcasesTab from '../testcase-tab'
import useProtectedRoute from '@/hooks/UseProtectedRoute'
import { useRouter } from 'next/router'
import CodeMirrorEditor from '../editor'
import { Category, IMatch, SortedComplexity } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import { getMatchDetails } from '@/services/matching-service-api'
import { convertSortedComplexityToComplexity } from '@repo/question-types'
import Chat from './chat'
import io, { Socket } from 'socket.io-client'
import UserAvatar from '@/components/customs/custom-avatar'
import { toast } from 'sonner'
import { ISubmission } from '@repo/submission-types'
import { mapLanguageToJudge0 } from '@/util/language-mapper'
import TestResult from '../test-result'
import { Cross1Icon } from '@radix-ui/react-icons'
import { getCollabHistory } from '@/services/collaboration-service-api'
import ReadOnlyCodeMirrorEditor from '../read-only-editor'
import { ResultModel } from '@repo/collaboration-types'

const formatQuestionCategories = (cat: Category[]) => {
    return cat.join(', ')
}

export default function Code() {
    const router = useRouter()
    const [isChatOpen, setIsChatOpen] = useState(true)
    const { id } = router.query
    const editorRef = useRef<{ getText: () => string } | null>(null)
    const [editorLanguage, setEditorLanguage] = useState<LanguageMode>(LanguageMode.Javascript)
    const testTabs = ['Testcases', 'Test Results']
    const [activeTestTab, setActiveTestTab] = useState(0)
    const [matchData, setMatchData] = useState<IMatch>()
    const [collabData, setCollabData] = useState<ICollabDto>()
    const socketRef = useRef<Socket | null>(null)
    const [isOtherUserOnline, setIsOtherUserOnline] = useState(true)
    const [isCodeRunning, setIsCodeRunning] = useState(false)
    const [activeTest, setActiveTest] = useState(0)
    const [testResult, setTestResult] = useState<{ data: ResultModel | undefined; expectedOutput: string } | undefined>(
        undefined
    )
    const [isViewOnly, setIsViewOnly] = useState(true)

    const retrieveMatchDetails = async () => {
        const matchId = router.query.id as string
        if (!matchId) {
            router.push('/')
            return
        }
        const response = await getMatchDetails(matchId).catch((_) => {
            toast.error('Match does not exists')
            router.push('/')
        })
        if (response) {
            setMatchData(response)
            setIsViewOnly(response.isCompleted)
            if (response.isCompleted) {
                const collabResponse = await getCollabHistory(matchId)
                setEditorLanguage(collabResponse?.language ?? LanguageMode.Javascript)
                setCollabData(collabResponse)
            }
        }
    }

    const { data: sessionData } = useSession()

    useEffect(() => {
        retrieveMatchDetails()
    }, [])

    useEffect(() => {
        if (isViewOnly) return

        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL ?? 'ws://localhost:3009', {
            path: process.env.NEXT_PUBLIC_API_URL ? '/collab/chat/ws/socket.io/' : '/socket.io',
            auth: {
                token: sessionData?.user.accessToken,
                name: sessionData?.user.username,
                roomId: id as string,
            },
        })

        socketRef.current.on('connect', () => {
            if (socketRef.current) {
                socketRef.current.emit('joinRoom', { roomId: id })
            }
        })

        socketRef.current.on('update-language', (language: string) => {
            setEditorLanguage(language as LanguageMode)
            toast.success('Language mode updated')
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

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [isViewOnly])

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
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
            socketRef.current.disconnect()
        }
        router.push('/')
    }

    const renderCloseButton = () => {
        return isViewOnly ? (
            <>
                <Cross1Icon className="mr-2" />
                Close
            </>
        ) : (
            <>
                <EndIcon fill="white" className="mr-2" />
                End Session
            </>
        )
    }

    const { loading } = useProtectedRoute()

    if (loading) return null

    return (
        <div className="flex gap-3">
            <section className="w-1/3 flex flex-col h-fullscreen">
                <div className="flex items-center gap-4">
                    <Image src="/logo.svg" alt="Logo" width={28} height={28} className="my-2" />
                    <h2 className="text-lg font-medium">
                        Session with:{' '}
                        {sessionData?.user.username !== matchData?.user1Name
                            ? matchData?.user1Name
                            : matchData?.user2Name}
                    </h2>
                </div>
                <div
                    id="question-data"
                    className="flex-grow border-2 rounded-lg border-slate-100 mt-2 py-2 px-3 overflow-y-auto"
                >
                    <h3 className="text-lg font-medium">{matchData?.question.title}</h3>
                    <div className="flex gap-3 my-2 text-sm">
                        <DifficultyLabel
                            complexity={convertSortedComplexityToComplexity(
                                matchData?.question.complexity ?? SortedComplexity.EASY
                            )}
                        />
                        <CustomLabel
                            title={formatQuestionCategories(matchData?.question.categories ?? [])}
                            textColor="text-theme"
                            bgColor="bg-theme-100"
                        />
                    </div>
                    <div className="mt-6 whitespace-pre-wrap">{matchData?.question.description}</div>
                </div>

                <div className="border-2 rounded-lg border-slate-100 mt-4 max-h-twoFifthScreen flex flex-col">
                    <div className="flex items-center justify-between border-b-[1px] pl-3 ">
                        <h3 className="text-lg font-medium">Chat</h3>
                        <Button variant="iconNoBorder" size="icon" onClick={toggleChat}>
                            <Image
                                src={`/icons/${isChatOpen ? 'minimise' : 'maximise'}.svg`}
                                alt="Minimise chat"
                                width={20}
                                height={20}
                            />
                        </Button>
                    </div>
                    {isChatOpen && <Chat socketRef={socketRef} isViewOnly={isViewOnly} />}
                </div>
            </section>
            <section className="w-2/3 flex flex-col h-fullscreen">
                <div id="control-panel" className="flex justify-between">
                    <div className="flex gap-3">
                        {!isViewOnly && (
                            <Button variant={'primary'} onClick={handleRunTests} disabled={isCodeRunning}>
                                {isCodeRunning ? (
                                    'Executing...'
                                ) : (
                                    <>
                                        {' '}
                                        <PlayIcon fill="white" height="18px" width="18px" className="mr-2" />
                                        Run test
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-row items-center">
                        {!isViewOnly && (
                            <UserAvatar
                                username={
                                    matchData?.user1Id === sessionData?.user.id
                                        ? matchData?.user2Name
                                        : matchData?.user1Name
                                }
                                isOnline={isOtherUserOnline}
                            />
                        )}
                        <Button className="bg-red hover:bg-red-dark" onClick={handleEndSession}>
                            {renderCloseButton()}
                        </Button>
                    </div>
                </div>
                <div id="editor-container" className="mt-4">
                    <div id="language-mode-select" className="rounded-t-xl bg-black">
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
                <div
                    id="test-results-container"
                    className="border-2 rounded-lg border-t-0 rounded-t-none border-slate-100 flex-grow overflow-y-auto"
                >
                    <div className="m-4 flex overflow-x-auto">
                        {activeTestTab === 0 ? (
                            <TestcasesTab
                                activeTestcaseIdx={activeTest}
                                setActiveTestcaseIdx={setActiveTest}
                                testInputs={matchData?.question.testInputs ?? []}
                                testOutputs={matchData?.question.testOutputs ?? []}
                            />
                        ) : (
                            <TestResult
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
                </div>
            </section>
        </div>
    )
}
