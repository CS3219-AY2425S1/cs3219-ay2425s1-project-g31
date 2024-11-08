'use client'

import ConfirmDialog from '@/components/customs/confirm-dialog'
import CustomForm from '@/components/customs/custom-form'
import CustomModal from '@/components/customs/custom-modal'
import Datatable from '@/components/customs/datatable'
import Loading from '@/components/customs/loading'
import { Button } from '@/components/ui/button'
import useProtectedRoute from '@/hooks/UseProtectedRoute'
import {
    createQuestionRequest,
    deleteQuestionById,
    getQuestionbyIDRequest,
    getQuestionsRequest,
    updateQuestionRequest,
} from '@/services/question-service-api'
import { IGetQuestions, IPagination, IQuestion, ISortBy, Modification, QuestionStatus, SortDirection } from '@/types'
import { capitalizeFirst } from '@/util/string-modification'
import { Complexity, Role } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { formFields, getColumns } from './props'

export default function Questions() {
    const { data: session } = useSession()
    const isAdmin = session?.user.role === Role.ADMIN

    const [data, setData] = useState<IQuestion[]>([])
    const [pagination, setPagination] = useState<IPagination>({
        totalPages: 1,
        currentPage: 1,
        totalItems: 0,
        limit: 5,
    })

    const [sortBy, setSortBy] = useState({
        sortKey: 'complexity',
        direction: SortDirection.NONE,
    })

    const [modalData, setModalData] = useState({
        title: '',
        content: '',
        isOpen: false,
    })

    const [dialogData, setDialogData] = useState({
        title: '',
        content: '',
        isOpen: false,
    })

    const [modificationType, setModificationType] = useState<Modification>(Modification.CREATE)

    const [questionData, setQuestionData] = useState<IQuestion>({
        id: '',
        title: '',
        description: '',
        categories: [],
        complexity: Complexity.EASY,
        status: QuestionStatus.NOT_ATTEMPTED,
        link: '',
        testCases: [
            {
                input: '',
                output: '',
            },
        ],
    })

    const load = async (body: IGetQuestions) => {
        try {
            const res = await getQuestionsRequest(body)
            if (res) {
                setData(res.questions)
                if (res.pagination.currentPage > res.pagination.totalPages && res.pagination.totalPages > 0) {
                    body.page = res.pagination.totalPages
                    load(body)
                }
                setPagination(res.pagination)
            }
        } catch (error) {
            toast.error('Failed to fetch questions' + error)
        }
    }

    const loadData = async () => {
        const body: IGetQuestions = {
            page: pagination.currentPage,
            limit: pagination.limit,
            sortBy: sortBy,
        }
        await load(body)
    }

    const sortHandler = (sortBy: ISortBy) => {
        setSortBy(sortBy)
        const body: IGetQuestions = {
            page: pagination.currentPage,
            limit: pagination.limit,
            sortBy: sortBy,
        }
        load(body)
    }

    const paginationHandler = async (page: number, limit: number) => {
        const body: IGetQuestions = {
            page: page,
            limit: limit,
            sortBy: sortBy,
        }
        load(body)
    }

    const handleCloseModal = () => {
        clearFormData()
        setModalData({
            ...modalData,
            isOpen: false,
        })
    }

    const handleSubmitButton = () => {
        const title = capitalizeFirst(`${modificationType} question`)
        setDialogData({
            title: title,
            content: `Are you sure you want to ${modificationType} this question?`,
            isOpen: true,
        })
    }

    const handleConfirmDialog = async () => {
        if (modificationType === Modification.CREATE) {
            try {
                const res = await createQuestionRequest(questionData)
                if (res) {
                    toast.success('Question created successfully')
                    handleCloseModal()
                }
            } catch (error: unknown) {
                toast.error((error as Error).message)
                return
            }
        } else if (modificationType === Modification.UPDATE) {
            try {
                const res = await updateQuestionRequest(questionData)
                if (res) {
                    toast.success('Question updated successfully')
                    handleCloseModal()
                }
            } catch (error: unknown) {
                toast.error((error as Error).message)
                return
            }
        } else if (modificationType === Modification.DELETE) {
            if (!questionData.id) return
            try {
                const res = await deleteQuestionById(questionData.id)
                if (res) {
                    toast.success('Question deleted successfully')
                }
            } catch (error) {
                toast.error('Failed to delete question' + error)
                return
            }
        }
        refreshTable()
        setDialogData({
            ...dialogData,
            isOpen: false,
        })
    }

    const clearFormData = () => {
        setQuestionData({
            ...questionData,
            title: '',
            description: '',
            categories: [],
            complexity: Complexity.EASY,
            status: QuestionStatus.NOT_ATTEMPTED,
            link: '',
            testCases: [
                {
                    input: '',
                    output: '',
                },
            ],
        })
    }

    const actionsHandler = async (modicationType: Modification, elemId?: string) => {
        if (!elemId) return
        setModificationType(modicationType)
        if (modicationType === Modification.UPDATE) {
            try {
                const res = await getQuestionbyIDRequest(elemId)
                if (res) {
                    setQuestionData(res)
                    setModalData({
                        ...modalData,
                        isOpen: true,
                        title: 'Update question',
                    })
                }
            } catch (error) {
                toast.error('Failed to fetch question' + error)
                return
            }
        } else if (modicationType === Modification.DELETE) {
            setQuestionData({
                ...questionData,
                id: elemId,
            })
            setDialogData({
                title: 'Delete question',
                content: 'Are you sure you want to delete this question?',
                isOpen: true,
            })
        }
    }

    const refreshTable = () => {
        loadData()
    }

    const { loading } = useProtectedRoute()

    useEffect(() => {
        if (!session) return
        loadData()
    }, [])

    if (loading)
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <Loading />
            </div>
        )

    return (
        <div className="m-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Questions</h2>
                {isAdmin && (
                    <Button
                        variant={'primary'}
                        onClick={() => {
                            setModalData({
                                ...modalData,
                                title: 'Create new question',
                                isOpen: true,
                            })
                            setModificationType(Modification.CREATE)
                        }}
                    >
                        Create
                    </Button>
                )}
            </div>
            <Datatable
                data={data}
                columns={getColumns(isAdmin)}
                pagination={pagination}
                sortBy={sortBy}
                sortHandler={sortHandler}
                paginationHandler={paginationHandler}
                actionsHandler={actionsHandler}
            />
            {modalData.isOpen && (
                <CustomModal
                    title={modalData.title}
                    className="h-3/4 w-3/4"
                    showCloseButton={true}
                    closeHandler={handleCloseModal}
                >
                    <CustomForm fields={formFields} data={questionData} submitHandler={handleSubmitButton} />
                </CustomModal>
            )}
            <ConfirmDialog
                dialogData={dialogData}
                closeHandler={() => setDialogData({ ...dialogData, isOpen: false })}
                confirmHandler={handleConfirmDialog}
            />
        </div>
    )
}
