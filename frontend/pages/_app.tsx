import Layout from '@/components/layout/layout'
import Toaster from '@/components/login/ui/toast/toaster'
import '@/styles/globals.css'

import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />
            <Toaster />
        </Layout>
    )
}