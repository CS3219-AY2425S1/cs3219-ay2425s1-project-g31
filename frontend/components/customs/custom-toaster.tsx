import { Toaster } from 'sonner'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const CustomToaster = () => {
    return (
        <Toaster
            icons={{
                success: <CheckCircleIcon sx={{ color: '#34D399' }} />,
                error: <ErrorIcon sx={{ color: '#FF4B4B' }} />,
            }}
            toastOptions={{
                unstyled: false,
                className: 'border border-gray-200 rounded-lg gap-4 shadow-md',
                duration: 2000,
            }}
            position="top-center"
        />
    )
}

export default CustomToaster
