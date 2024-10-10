import '@/styles/globals.css'

import { AppProps } from 'next/app'
import CustomToaster from '@/components/customs/custom-toaster'
import Layout from '@/components/layout/layout'
import { RecoilRoot } from 'recoil'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session} refetchInterval={60}>
            <RecoilRoot>
                <Layout>
                    <Component {...pageProps} />
                    <CustomToaster />
                </Layout>
            </RecoilRoot>
        </SessionProvider>
    )
}
