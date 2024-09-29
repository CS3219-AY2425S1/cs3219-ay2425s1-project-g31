'use client'

import * as React from 'react'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import Image from 'next/image'
import Link from 'next/link'
import { LogOutIcon } from 'lucide-react'
import { useSetRecoilState } from 'recoil'
import { tokenState, userState } from '@/atoms/auth'

export function NavBar() {
    const setIsAuth = useSetRecoilState(userState)
    const setIsValid = useSetRecoilState(tokenState)
    return (
        <div className="flex justify-between border-b-[1px]">
            <Link href="/" legacyBehavior passHref>
                <div className={navigationMenuTriggerStyle()}>
                    <Image src="/logo.svg" alt="Logo" width={30} height={30} />
                </div>
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/questions" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Questions</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/sessions" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sessions</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/account" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Account</NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Link
                href="/auth"
                onClick={() => {
                    setIsAuth(false)
                    setIsValid(false)
                    sessionStorage.clear()
                }}
            >
                <div className={navigationMenuTriggerStyle()}>
                    <LogOutIcon />
                </div>
            </Link>
        </div>
    )
}
