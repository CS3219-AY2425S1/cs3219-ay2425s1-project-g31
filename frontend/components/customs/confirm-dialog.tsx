import CustomModal from './custom-modal'

interface ConfirmDialogProps {
    dialogData: {
        isOpen: boolean
        title: string
        content: string
    }
    closeHandler: () => void
    confirmHandler: () => void
    className?: string
}

export default function ConfirmDialog({ dialogData, className, closeHandler, confirmHandler }: ConfirmDialogProps) {
    return (
        dialogData.isOpen && (
            <CustomModal
                title={dialogData.title || 'Warning!'}
                className={`h-2/5 z-[2000] ${className || ''}`}
                closeHandler={closeHandler}
                showActionPanel={true}
                confirmHandler={confirmHandler}
            >
                {dialogData.content}
            </CustomModal>
        )
    )
}
