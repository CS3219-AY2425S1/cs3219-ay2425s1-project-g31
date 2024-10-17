import Profile from './Profile'
import Setting from './Settings'
import CustomTabs from '../customs/custom-tabs'
import { useState } from 'react'
import React from 'react'

const AccountSetting = () => {
    const accountTabs = ['Profile', 'Setting']
    const [activeTab, setActiveTab] = useState(0) // 0: Profile, 1: Setting

    const handleActiveTabChange = (tab: number) => {
        setActiveTab(tab)
        console.log(activeTab)
    }

    return (
        <>
            <div className="h-[calc(100vh-101px)]">
                <div className="flex flex-col flex-grow w-full h-full pl-6 pt-3">
                    <div className="flex flex-row mb-3">
                        <CustomTabs
                            tabs={accountTabs}
                            handleActiveTabChange={handleActiveTabChange}
                            isBottomBorder={true}
                            className="flex flex-[4]"
                            btnclassName="text-lg"
                        />
                        <div className="flex flex-[2]"></div>
                    </div>
                    {activeTab === 0 ? <Profile /> : <Setting />}
                </div>
            </div>
        </>
    )
}

export default AccountSetting
