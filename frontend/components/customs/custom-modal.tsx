import { CloseIcon } from '@/assets/icons'
import { Button } from '../ui/button'

interface CustomModalProps {
    title?: string
    closeHandler?: () => void
    className?: string
    children?: React.ReactNode
    showCloseButton?: boolean
    showActionPanel?: boolean
    confirmHandler?: () => void
    showCancelButton?: boolean
}

export default function CustomModal({
    title,
    closeHandler,
    className,
    children,
    showCloseButton,
    showActionPanel,
    confirmHandler,
    showCancelButton = true,
}: CustomModalProps) {
    return (
        <div className="fixed top-0 left-0 w-full h-screen max-h-screen bg-gray-400/50 flex items-center justify-center z-[999]">
            <div className={`h-2/3 w-2/3 bg-white p-10 overflow-y-auto flex flex-col justify-between ${className}`}>
                <div>
                    {(title || showCloseButton) && (
                        <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-4 mb-6">
                            {title && <h2 className="text-xl font-bold">{title}</h2>}
                            {showCloseButton && (
                                <Button variant="iconNoBorder" size="icon" onClick={closeHandler}>
                                    <CloseIcon />
                                </Button>
                            )}
                        </div>
                    )}
                    {children}
                </div>
                {showActionPanel && (
                    <div className="flex flex-row-reverse gap-4">
                        <Button variant="primary" size="lg" onClick={confirmHandler}>
                            Confirm
                        </Button>
                        {showCancelButton && (
                            <Button variant="secondary" size="lg" onClick={closeHandler}>
                                Cancel
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
