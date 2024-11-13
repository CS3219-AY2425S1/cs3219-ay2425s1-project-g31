'use client'

import { NavBar } from '@/components/layout/navbar'
import React from 'react'
import { inter } from '@/styles/fonts'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { data: session } = useSession()
    const router = useRouter()

    // Routes that should hide navbar
    const navBlacklist = [
        {
            name: 'code',
            route: '/code',
        },
    ]

    const isHideNavbar = navBlacklist.some((item) => router.pathname.includes(item.route))
    const topMargin = isHideNavbar ? 'mt-5' : 'mt-[4rem]'

    return (
        <div>
            {session ? (
                <div className="initial">
                    {!isHideNavbar && <NavBar className="z-[995] fixed w-full top-0 bg-white" />}
                    <div className={`${topMargin} mx-10 ${inter.className}`}>{children}</div>
                </div>
            ) : (
                children
            )}
        </div>
    )
}
