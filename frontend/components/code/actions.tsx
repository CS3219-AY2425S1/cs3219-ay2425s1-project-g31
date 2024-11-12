import ConfirmDialog from '../customs/confirm-dialog'
import UserAvatar from '../customs/custom-avatar'
import { LongTextSkeleton } from '../customs/custom-loader'
import { Button } from '../ui/button'
import { EndIcon, PlayIcon } from '@/assets/icons'
import { Cross1Icon } from '@radix-ui/react-icons'

export const CodeActions = ({
    isLoading,
    isViewOnly,
    handleRunTests,
    isCodeRunning,
    isOtherUserOnline,
    handleEndSession,
    username,
    isDialogOpen,
    setIsDialogOpen,
    handleEndSessionConfirmation,
}: {
    isLoading: boolean
    isViewOnly: boolean
    handleEndSession: () => void
    handleRunTests: () => void
    isCodeRunning: boolean
    isOtherUserOnline: boolean
    username: string | undefined
    isDialogOpen: boolean
    setIsDialogOpen: (isOpen: boolean) => void
    handleEndSessionConfirmation: () => void
}) => {
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

    if (isLoading) {
        return <LongTextSkeleton />
    }

    return (
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
                {!isViewOnly && <UserAvatar username={username ?? ''} isOnline={isOtherUserOnline} />}
                <Button className="bg-red hover:bg-red-dark" onClick={handleEndSession}>
                    {renderCloseButton()}
                </Button>
                <ConfirmDialog
                    showCancelButton
                    dialogData={{
                        title: 'Warning!',
                        content:
                            'Are you sure you want to end the session? This will permanently end the session for both you and the other participant.',
                        isOpen: isDialogOpen,
                    }}
                    closeHandler={() => setIsDialogOpen(false)}
                    confirmHandler={handleEndSessionConfirmation}
                />
            </div>
        </div>
    )
}
