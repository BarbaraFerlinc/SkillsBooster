import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DynamicHeader from "../partials/dashboard/DynamicHeader";
import { NavLink } from "react-router-dom";

function Profile() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const user = location.state.user;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <DynamicHeader domainName={`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Profil`} />
                        {/* Cards */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Card (Customers) */}
                            {user.role === 'admin' && <DashboardCard10 />}
                            {user.role === 'boss' && <div>User-specific content</div>}
                            {user.role === 'user' && <div>User-specific content</div>}
                        </div>
                        {/* Dashboard actions */}
                        {user.role === 'admin' && (
                            <div className="sm:flex sm:justify-between sm:items-center mb-8">
                                {/* Right: Actions */}
                                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                    {/* Add user button */}
                                    <NavLink to="/addUser">
                                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                                            <span className="hidden xs:block ml-2">Add User</span>
                                        </button>
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
