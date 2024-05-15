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
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Welcome banner */}
                        <WelcomeBanner />

                        {/* Dashboard actions */}
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                {/* Add view button */}
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                                    <svg className="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                    </svg>
                                    <span className="hidden xs:block ml-2">Add view</span>
                                </button>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Card 1 */}
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
                                <h2 className="text-lg font-semibold text-slate-800 mb-2">Registriraj podjetje</h2>
                                <p className="text-sm text-slate-600 mb-4">Create a new account to get started with our services.</p>
                                <NavLink to="/register" className="btn bg-blue-500 hover:bg-blue-600 text-white">
                                    Go to Registration
                                </NavLink>
                            </div>

                            {/* Card 2 */}
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
                                <h2 className="text-lg font-semibold text-slate-800 mb-2">Prijava</h2>
                                <p className="text-sm text-slate-600 mb-4">Already have an account? Log in here.</p>
                                <NavLink to="/login" className="btn bg-green-500 hover:bg-green-600 text-white">
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
