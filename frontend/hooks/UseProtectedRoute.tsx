// hooks/useProtectedRoute.ts

import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const useProtectedRoute = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'loading') return

        if (!session) {
            router.push('/auth')
        } else {
            setIsLoading(false)
        }
    }, [session, status, router])

    return { session, loading: isLoading }
}

export default useProtectedRoute
