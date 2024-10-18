import AccountSettings from '@/components/account/AccountSetting'
import Loading from '@/components/customs/loading'
import useProtectedRoute from '@/hooks/UseProtectedRoute'

export default function Account() {
    const { loading } = useProtectedRoute()
    if (loading)
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center">
                <Loading />
            </div>
        )
    return <AccountSettings />
}
