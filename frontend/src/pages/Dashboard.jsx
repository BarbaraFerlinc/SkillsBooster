
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            {/*<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />*/}

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Welcome banner */}
                        <WelcomeBanner/>

                        {/* Dashboard actions */}
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">

                            </div>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-8 gap-4">
                            {/* Card 1 */}
                            <div
                                className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
                                <h2 className="text-lg font-semibold text-slate-800 mb-2">Register your comany</h2>
                                <p className="text-sm text-slate-600 mb-4">Create a new account to get started with our
                                    services.</p>
                                <NavLink to="/register"
                                         className="btn bg-purple-300 hover:bg-purple-400 text-white"> {/* Change bg-blue-500 to bg-purple-300 */}
                                    Go to Registration
                                </NavLink>
                            </div>

                            {/* Card 2 */}
                            <div
                                className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
                                <h2 className="text-lg font-semibold text-slate-800 mb-2">Login</h2>
                                <p className="text-sm text-slate-600 mb-4">Already have an account? Log in here.</p>
                                <NavLink to="/login"
                                         className="btn bg-blue-300 hover:bg-blue-400 text-white"> {/* Change bg-green-500 to bg-blue-300 */}
                                    Go to Login
                                </NavLink>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
