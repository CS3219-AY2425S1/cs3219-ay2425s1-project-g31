'use client'

import { userState, tokenState } from '@/atoms/auth'
import { NavBar } from '@/components/layout/navbar'
import { inter } from '@/styles/fonts'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import React from 'react'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const { pathname } = router
    const [isAuth, setIsAuth] = useRecoilState(userState)
    const [isValidToken, setIsValidToken] = useRecoilState(tokenState)

    const isValid = () => {
        const ttl = new Date(sessionStorage.getItem('TTL') ?? '').getTime()
        const currentTime = new Date().getTime()
        // Hard Coded Time Out, to change into env later
        if (currentTime - ttl <= 3600000) {
            return true
        } else {
            sessionStorage.setItem('isAuth', 'false')
            setIsAuth(false)
            setIsValidToken(false)
            return false
        }
    }

    useEffect(() => {
        setIsAuth(Boolean(sessionStorage.getItem('isAuth')))
        if (isValid()) {
            setIsValidToken(true)
            if (pathname === '/auth') {
                router.push('/')
            }
        } else {
            setIsValidToken(false)
            setIsAuth(false)
            router.push('/auth')
        }
    }, [setIsAuth, setIsValidToken])

    return (
        <>
            {isAuth && isValidToken ? (
                <>
                    <NavBar />
                    <div className={`${inter.className} mx-10 my-6`}>{children}</div>
                </>
            ) : (
                children
            )}
        </>
    )
}
