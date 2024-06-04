import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar.jsx';
import Header from '../../partials/Header.jsx';
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import ProfileInfo from './ProfileInfo.jsx';
import AdminProfile from './AdminProfile.jsx';
import BossProfile from './BossProfile.jsx';
import EmployeeProfile from './EmployeeProfile.jsx';

function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const user = location.state.user;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <DynamicHeader domainName={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Profile`} />

                        {/* Profile Info Card */}
                        <ProfileInfo user={user} />

                        {user.role === 'admin' && <AdminProfile />}
                        {user.role === 'boss' && <BossProfile />}
                        {user.role === 'user' && <EmployeeProfile userId={user.id} />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
