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

                    // api.interceptors.request.use((config) => {
                    //     console.log(config.baseURL) // Logs the full request URL
                    //     console.log('hello')

                    //     return config
                    // })

                    const response = await api.post('/auth/login', { usernameOrEmail: username, password })

                    if (!response) {
                        throw new Error('Invalid username or password')
                    }

                    return { ...response.data, accessTokenExpires: Date.now() + 3600 * 1000 }
                } catch (error) {
                    throw new Error('Authentication failed')
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                return { ...token, ...user }
            }

            if (trigger === 'update' && session?.user) {
                return {
                    ...token,
                    ...session.user,
                }
            }

            if (Date.now() > (token.accessTokenExpires as number)) {
                return Promise.reject(new Error('Access token has expired'))
            }

            return token
        },
        async session({ session, token }) {
            session.user = token as any
            return session
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 3600,
    },
    // secret: process.env.NEXTAUTH_SECRET,
    secret: 'a2ca69058c7da5cf77aa626555e62a3124973b3e3459fe66d874abe71777d3fb',
})
