// next-auth.d.ts
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    // Extend the default `user` type
    interface User {
        id: string
        email: string
        username: string
        role: string
        proficiency: string
        accessToken: string
    }

    // Extend the default `session` type to include all custom fields
    interface Session {
        user: {
            id: string
            email: string
            username: string
            role: string
            proficiency: string
            accessToken: string
        }
    }
}

declare module 'next-auth/jwt' {
    // Extend the default `JWT` type to include custom fields
    interface JWT {
        data?: {
            id: string
            email: string
            username: string
            role: string
            proficiency: string
            accessToken: string
        }
    }
}
