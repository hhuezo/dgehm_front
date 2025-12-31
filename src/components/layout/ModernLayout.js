import React from 'react'
import Header from 'components/template/Header'
// import SidePanel from 'components/template/SidePanel'
import UserDropdown from 'components/template/UserDropdown'
import SideNavToggle from 'components/template/SideNavToggle'
import MobileNav from 'components/template/MobileNav'
import SideNav from 'components/template/SideNav'
import View from 'views'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            {/* <SidePanel /> */}
            <UserDropdown hoverable={false} />
        </>
    )
}

const ModernLayout = (props) => {

    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />

                {/* ---------- main column ---------- */}
                <div
                    className="
                flex flex-col flex-auto min-h-screen min-w-0 relative w-full
                app-shell app-shell-border border-l
            "
                >
                    <Header
                        className="app-shell-border border-b sticky top-0 z-30 bg-white dark:bg-gray-800 transition-all duration-200"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />

                    <View {...props} />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
