import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { quizzes } from "../../Data.jsx";
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import { NavLink } from "react-router-dom";

function Kviz() {
    const { id } = useParams(); // Get the quiz id from the URL parameters
    const quiz = quizzes.find(quiz => quiz.id === parseInt(id)); // Find the quiz data based on the id

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
                        {/* Main Header */}
                        <DynamicHeader domainName={quiz?.name} />
                        <h1 className="text-lg font-semibold text-slate-800 mb-2"></h1>

                        <div className="result">

                            <NavLink
                                to="/domena/:id"
                                className="btn bg-blue-300 hover:bg-blue-400 text-white"
                            >
                                Nazaj
                            </NavLink>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Kviz;
