import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const UserAvatar = ({ username, isOnline }: { username: string | undefined; isOnline: boolean }) => {
    const initial = username ? username.charAt(0).toUpperCase() : '?'
    const circleColor = isOnline ? 'bg-green-700' : 'bg-red-500'

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {' '}
                    <div className="flex items-center mr-3">
                        <div
                            className={`relative w-10 h-10 rounded-full ${circleColor} flex items-center justify-center`}
                        >
                            <div className="bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                <span className="text-lg font-bold text-white">{initial}</span>
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {isOnline
                            ? 'The other user is currently active!'
                            : 'The other user has disconnected from the session!'}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default UserAvatar
