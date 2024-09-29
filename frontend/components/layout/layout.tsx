import { userState } from '@/atoms/auth'
import { NavBar } from '@/components/layout/navbar'
import { inter } from '@/styles/fonts'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [isAuth, setIsAuth] = useRecoilState(userState)
    const [isInit, setIsInit] = useState(false)
    const router = useRouter()
    const { pathname } = router

    const validateToken = () => {}

    // Initialises on startup/refresh
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                const isTokenValid = await validateToken()
                setIsAuth(!!isTokenValid)
            } else {
                setIsAuth(false)
            }
            setIsInit(true)
        }

        checkToken()
    }, [setIsAuth])

    useEffect(() => {
        if (!isAuth && pathname !== '/auth') {
            router.push('/auth')
        }
    }, [isAuth, pathname, router])

    // Prevent rendering children if not authenticated and not on /auth
    if (!isInit || (!isAuth && pathname !== '/auth')) {
        return null
    }

    return (
        <>
            {isAuth ? (
                children
            ) : (
                <>
                    <NavBar />
                    <div className={`${inter.className} mx-10 my-6`}>{children}</div>
                </>
            )}
        </>
    )
}
