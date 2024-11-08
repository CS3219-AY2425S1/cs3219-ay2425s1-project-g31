'use client'

import Loading from '@/components/customs/loading'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Login from '../../components/auth/Login'
import Signup from '../../components/auth/Signup'

export default function Auth() {
    const [isLoginPage, setIsLoginPage] = useState(true)
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <Loading />
            </div>
        )
    }

    if (session) {
        router.push('/')
    }

    const handleSignUpSuccessful = () => {
        setIsLoginPage(true)
    }

    return (
        <div className="grid grid-cols-2 h-screen">
            <div className="w-full h-full bg-gradient-to-b from-[#FCF7FC] via-[#FCF7FC] to-[#E8E1F6] flex flex-col justify-center">
                <h2 className="pl-[59px] font-semibold text-6xl">PeerPrep</h2>
                <p className="pl-[59px] text-gray-600 font-semibold mt-4">
                    Connect, Collaborate, Code: Unlock Your Potential Together
                </p>
                <div className="flex justify-center mt-8">
                    <Image priority={true} src="/img.png" width={400} height={400} alt="heillo i am a pro" />
                </div>
            </div>
            <div className="m-16">
                <div className="flex justify-end mb-12">
                    <button
                        onClick={() => {
                            setIsLoginPage((x) => !x)
                        }}
                    >
                        {isLoginPage ? 'Sign up' : 'Log in'}
                    </button>
                </div>
                <div className="flex flex-col items-center sm:items-start w-full mx-auto max-w-md">
                    <div className="flex flex-col items-center justify-center my-5 w-full gap-8">
                        <Image src="/logo.svg" alt="Logo" width={30} height={30} className="my-2 mx-8" />
                        <h2 className="text-2xl font-bold mb-4">Start your journey with us!</h2>
                    </div>
                    <div className="flex flex-col items-center gap-3 mt-3 w-full">
                        {isLoginPage ? <Login /> : <Signup handleSignUpSuccessful={handleSignUpSuccessful} />}
                    </div>
                </div>
            </div>
        </div>
    )
}
