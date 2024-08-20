import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar.jsx';
import Header from '../../partials/Header.jsx';
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import ProfileInfo from './ProfileInfo.jsx';
import AdminProfile from './AdminProfile.jsx';
import ManagerProfile from './ManagerProfile.jsx';
import EmployeeProfile from './EmployeeProfile.jsx';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const { user } = UserAuth();

    useEffect(() => {
        if (user) {
          const userEmail = user.email;
    
          api.post('/user/id', { id: userEmail })
            .then(res => {
              const profile = res.data;
              setCurrentUser(profile);
            })
            .catch(err => {
              console.error(err);
            });
        }
      }, [user]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <DynamicHeader domainName={currentUser?.full_name} />

                        {/* Profile Info Card */}
                        <ProfileInfo user={currentUser} />

                        {currentUser?.role === 'admin' && <AdminProfile />}
                        {currentUser?.role === 'manager' && <ManagerProfile />}
                        {currentUser?.role === 'employee' && <EmployeeProfile />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
