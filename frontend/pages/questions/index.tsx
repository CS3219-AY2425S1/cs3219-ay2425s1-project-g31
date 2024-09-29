'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Datatable from '@/components/customs/datatable'
import {
    Difficulty,
    IGetQuestions,
    IPagination,
    IQuestion,
    ISortBy,
    Modification,
    QuestionStatus,
    SortDirection,
} from '@/types'
import { columns, formFields } from './props'
import CustomModal from '@/components/customs/custom-modal'
import CustomForm from '@/components/customs/custom-form'
import ConfirmDialog from '@/components/customs/confirm-dialog'
import { capitalizeFirst } from '@/util/string-modification'
import {
    createQuestionRequest,
    deleteQuestionById,
    getQuestionbyIDRequest,
    getQuestionsRequest,
    updateQuestionRequest,
} from '@/services/question-service-api'
import { toast } from 'sonner'

export default function Questions() {
    const [data, setData] = useState<IQuestion[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const [pagination, setPagination] = useState<IPagination>({
        totalPages: 1,
        currentPage: 1,
        totalItems: 0,
        limit: 10,
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
        complexity: Difficulty.Easy,
        status: QuestionStatus.NOT_ATTEMPTED,
        link: '',
    })

    const load = async (body: IGetQuestions) => {
        try {
            const res = await getQuestionsRequest(body)
            if (res) {
                setData(res.questions)
                if (res.pagination.currentPage > res.pagination.totalPages) {
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
        setLoading(true)
        const body: IGetQuestions = {
            page: pagination.currentPage,
            limit: pagination.limit,
            sortBy: sortBy,
        }
        await load(body)
        setLoading(false)
    }

    const [isInit, setIsInit] = useState(false)

    useEffect(() => {
        if (!isInit) {
            loadData()
        }
        setIsInit(true)
    }, [isInit])

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

    const handleSubmitButton = (data: any) => {
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
            } catch (error) {
                toast.error('Failed to create question' + error)
                return
            }
        } else if (modificationType === Modification.UPDATE) {
            // call put api
            try {
                const res = await updateQuestionRequest(questionData)
                if (res) {
                    toast.success('Question updated successfully')
                    handleCloseModal()
                }
            } catch (error) {
                toast.error('Failed to update question' + error)
                return
            }
        } else if (modificationType === Modification.DELETE) {
            // call delete api
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
            complexity: Difficulty.Easy,
            status: QuestionStatus.NOT_ATTEMPTED,
            link: '',
        })
    }

    const actionsHandler = async (modicationType: Modification, elemId?: string) => {
        if (!elemId) return
        setModificationType(modicationType)
        if (modicationType === Modification.UPDATE) {
            try {
                const res = await getQuestionbyIDRequest(elemId)
                if (res) {
                    console.log('res', res)
                    setQuestionData(res)
                    setModalData({
                        ...modalData,
                        isOpen: true,
                        title: 'Update question',
                    })
                    setModificationType(Modification.UPDATE)
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

    return (
        <div className="m-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Questions</h2>
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
            </div>
            <Datatable
                data={data}
                columns={columns}
                pagination={pagination}
                sortBy={sortBy}
                sortHandler={sortHandler}
                paginationHandler={paginationHandler}
                actionsHandler={actionsHandler}
            />
            {modalData.isOpen && (
                <CustomModal title={modalData.title} className="h-3/4 w-3/4" closeHandler={handleCloseModal}>
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
