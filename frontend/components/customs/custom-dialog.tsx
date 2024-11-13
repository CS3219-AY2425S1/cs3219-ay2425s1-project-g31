import { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ErrorIconDialog } from '@/assets/icons/error-icon'

interface CustomDialogProps {
    // Non-Function properties apply to trigger button.
    text: string
    className?: string
    type: 'button' | 'reset' | 'submit' | undefined
    variant:
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'iconNoBorder'
        | 'primary'
        | 'activeTab'
        | 'ghostTab'
        | 'activeTabLabel'
        | 'ghostTabLabel'
        | null
        | undefined
    description: string
    dialogOpen: boolean
    onDialogOpenChange?: Dispatch<SetStateAction<boolean>>
    onClickConfirm: () => void
    onClickTrigger?: () => void
}

function CustomDialogWithButton(props: CustomDialogProps) {
    return (
        <>
            <Dialog open={props.dialogOpen} onOpenChange={props.onDialogOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        type={props.type}
                        variant={props.variant}
                        className={props.className}
                        onClick={props.onClickTrigger} // Validate inputs before opening dialog
                    >
                        {props.text}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex flex-row gap-5">
                                <ErrorIconDialog />
                                {props.text || 'Warning'}
                            </div>
                            <span className="h-0.5 w-full bg-slate-200 mt-5"></span>
                        </DialogTitle>
                        <DialogDescription>{props.description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="primary"
                            className="text-base bg-btn"
                            onClick={props.onClickConfirm}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomDialogWithButton
