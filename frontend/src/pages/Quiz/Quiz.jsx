import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

const initialQuiz = {
    naziv: "No Quiz",
    rezultati: [],
    vprasanja: []
}

function Quiz() {
    const { id, domain } = useParams();
    const [currentQuiz, setCurrentQuiz] = useState(initialQuiz);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quizResult, setQuizResult] = useState(0);

    const { user } = UserAuth();

    useEffect(() => {
        if (id) {
            const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/kviz/id', { id: novId })
                .then(res => {
                    const kviz = res.data;
                    setCurrentQuiz(kviz);
                })
                .catch(err => {
                    console.error(err);
            });
        }
    }, [id]);

    // Simulated function to fetch quiz result
    const fetchQuizResult = async () => {
        if (id && user) {
            const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            try {
                const result = await api.post('/kviz/najdi-rezultat', { id: novId, uporabnikId: user.email });
                setQuizResult(result.data);
            } catch (err) {
                console.error(err);
                setQuizResult(null);
            }
        }
    };

    // useEffect to fetch quiz result on component mount
    useEffect(() => {
        if (user) {
            fetchQuizResult();
        }
    }, [id, user]);

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
                        <DynamicHeader domainName={currentQuiz?.naziv}/>

                        {/* Conditionally render Solve Quiz link only if quizResult is null */}
                        {<a
                            href={`/solveQuiz/${id}/${domain}`}
                            className="block py-2 px-4 text-lg text-blue-700 hover:text-gray-900 mb-4"
                            style={{ textDecoration: 'none' }}
                        >
                            Solve Quiz
                        </a>}

                        {/* Display quiz result percentage */}
                        {quizResult !== null && (
                            <div className="mb-4"> {/* Added mb-4 for margin-bottom */}
                                <p>Your score: {quizResult}%</p>
                            </div>
                        )}

                        <div className="result">
                            <Link
                                to={`/domain/${domain}`}
                                className="btn bg-indigo-500 text-white py-2 px-5 rounded mr-1"
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Quiz;
