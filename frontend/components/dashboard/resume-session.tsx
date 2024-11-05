import { Button } from '../ui/button'

export default function ResumeSession() {
    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            You have an ongoing session.
            <Button variant="primary" className="w-full mt-4">
                Resume
            </Button>
        </div>
    )
}
