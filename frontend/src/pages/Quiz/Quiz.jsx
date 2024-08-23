import React, { useEffect, useState } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

const initialQuiz = {
    name: "No Quiz",
    results: [],
    questions: []
};

function Quiz() {
    const { id, domain } = useParams();
    const [currentQuiz, setCurrentQuiz] = useState(initialQuiz);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quizResult, setQuizResult] = useState(0);

    const { user } = UserAuth();

    useEffect(() => {
        if (id) {
            const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/quiz/id', { id: newId })
                .then(res => {
                    const quiz = res.data;
                    setCurrentQuiz(quiz);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [id]);

    const fetchQuizResult = async () => {
        if (id && user) {
            const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            try {
                const result = await api.post('/quiz/find-result', { id: newId, userId: user.email });
                setQuizResult(result.data);
            } catch (err) {
                console.error(err);
                setQuizResult(null);
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchQuizResult();
        }
    }, [id, user]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Dynamic Header with Quiz Name */}
                        <DynamicHeader domainName={currentQuiz?.name}/>

                        {/* Conditionally render Solve Quiz link only if quizResult is null */}
                        <NavLink
                            to={`/solveQuiz/${id}/${domain}`}
                            className="block py-2 px-4 text-lg text-blue-700 hover:text-gray-900 mb-4"
                            style={{textDecoration: 'none'}}
                        >
                            Solve Quiz
                        </NavLink>

                        <div className="flex flex-col sm:flex-row justify-between items-center my-4">
                            <div className="flex items-center space-x-4">
                                {/* Conditionally render Solve Quiz link only if quizResult is null */}
                                {quizResult === null ? (
                                    <NavLink
                                        to={`/solveQuiz/${id}/${domain}`}
                                        className="btn bg-blue-500 text-white py-2 px-5 rounded hover:bg-indigo-500"
                                    >
                                        Start Quiz
                                    </NavLink>
                                ) : (
                                    <div className="text-lg font-medium text-gray-700">
                                        Your Score: <span className="text-indigo-500">{quizResult}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Back Button */}
                            <Link
                                to={`/domain/${domain}`}
                                className="btn bg-indigo-500 text-white py-2 px-5 rounded mt-4 sm:mt-0 hover:bg-indigo-600"
                            >
                                Back to Domain
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Quiz;