import CustomModal from './custom-modal'

export interface ConfirmDialogProps {
    dialogData: {
        isOpen: boolean
        title: string
        content: string
    }
    closeHandler: () => void
    confirmHandler: () => void
    className?: string
    showCancelButton?: boolean
}

export default function ConfirmDialog({
    dialogData,
    className,
    closeHandler,
    confirmHandler,
    showCancelButton = true,
}: ConfirmDialogProps) {
    return (
        dialogData.isOpen && (
            <CustomModal
                title={dialogData.title || 'Warning!'}
                className={`h-2/5 z-[2000] ${className || ''}`}
                closeHandler={closeHandler}
                showCloseButton={true}
                showCancelButton={showCancelButton}
                showActionPanel={true}
                confirmHandler={confirmHandler}
            >
                {dialogData.content}
            </CustomModal>
        )
    )
}
