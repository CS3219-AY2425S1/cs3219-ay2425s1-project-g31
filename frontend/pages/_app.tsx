import '@/styles/globals.css'

import { AppProps } from 'next/app'
import Layout from '@/components/layout/layout'
import CustomToaster from '@/components/customs/custom-toaster'
import { RecoilRoot } from 'recoil'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <Layout>
                <Component {...pageProps} />
                <CustomToaster />
            </Layout>
        </RecoilRoot>
    )
}
