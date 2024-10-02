import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import axios from 'axios'

interface Credentials {
    username: string
    password: string
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'email@site.com' },
                password: { label: 'Password', type: 'password', placeholder: 'password' },
            },
            async authorize(credentials, _req) {
                if (!credentials) {
                    throw new Error('No credentials provided')
                }

                const { username, password } = credentials as Credentials

                try {
                    const api = axios.create({
                        baseURL: 'http://localhost:3002',
                    })

                    const response = await api.post('/auth/login', { usernameOrEmail: username, password })

                    if (!response) {
                        throw new Error('Invalid username or password')
                    }

                    return response.data
                } catch (error) {
                    throw new Error('Authentication failed')
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === 'update') {
                return { ...token, ...session.user }
            }
            return { ...token, ...user }
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
})