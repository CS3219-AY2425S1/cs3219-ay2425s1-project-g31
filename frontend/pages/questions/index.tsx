'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Datatable from '@/components/customs/datatable'
import { Difficulty, IPagination, IQuestion, ISortBy, Modification, QuestionStatus, SortDirection } from '@/types'
import { columns, formFields } from './props'
import { mockQuestionsData } from '@/mock-data'
import CustomModal from '@/components/customs/custom-modal'
import CustomForm from '@/components/customs/custom-form'
import ConfirmDialog from '@/components/customs/confirm-dialog'
import { capitalizeFirst } from '@/util/string-modification'
import { IQuestionsApi } from '@/types/question'

async function getDataFromApi(): Promise<IQuestionsApi> {
    return {
        questions: mockQuestionsData,
        pagination: {
            totalPages: 10,
            currentPage: 1,
            totalItems: 96,
            limit: 10,
        },
    }
}

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
        sortKey: 'id',
        direction: SortDirection.NONE,
    })

    const [modalData, setModalData] = useState({
        title: '',
        content: '',
        isOpen: false,
        type: Modification.CREATE,
    })

    const [dialogData, setDialogData] = useState({
        title: '',
        content: '',
        isOpen: false,
    })

    const [questionData, setQuestionData] = useState<IQuestion>({
        id: '1',
        title: '',
        description: '',
        category: [],
        difficulty: Difficulty.Easy,
        status: QuestionStatus.NOT_ATTEMPTED,
    })

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            const res = await getDataFromApi()
            setData(res.questions)
            setPagination(res.pagination)
            setLoading(false)
        }
        loadData()
    }, [])

    const sortHandler = (sortBy: ISortBy) => {
        setSortBy(sortBy)
    }

    const paginationHandler = (page?: number, limit?: number) => {}

    const handleCloseModal = () => {
        clearFormData()
        setModalData({
            ...modalData,
            isOpen: false,
        })
    }

    const handleSubmitQuestionData = () => {
        const modicationType = modalData.type
        const title = capitalizeFirst(`${modicationType} question`)
        setDialogData({
            title: title,
            content: `Are you sure you want to ${modicationType} this question?`,
            isOpen: true,
        })
    }

    const handleConfirmDialog = () => {
        if (modalData.type === Modification.CREATE) {
            // call post api
        } else if (modalData.type === Modification.UPDATE) {
            // call put api
        }
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
            category: [],
            difficulty: Difficulty.Easy,
            status: QuestionStatus.NOT_ATTEMPTED,
        })
    }

    const actionsHandler = async (modicationType: Modification, elemId?: string) => {
        if (!elemId) return
        if (modicationType === Modification.UPDATE) {
            // get question data from api with elemId
            // questionData = await getQuestion()
            setQuestionData(questionData)
            setModalData({
                ...modalData,
                isOpen: true,
                title: 'Update question',
                type: Modification.UPDATE,
            })
        } else if (modicationType === Modification.DELETE) {
            setDialogData({
                title: 'Delete question',
                content: 'Are you sure you want to delete this question?',
                isOpen: true,
            })
        }
    }

    return (
        <div className="m-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Questions</h2>
                <Button
                    variant={'primary'}
                    onClick={() =>
                        setModalData({
                            ...modalData,
                            title: 'Create new question',
                            isOpen: true,
                            type: Modification.CREATE,
                        })
                    }
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
                    <CustomForm fields={formFields} data={questionData} submitHandler={handleSubmitQuestionData} />
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
