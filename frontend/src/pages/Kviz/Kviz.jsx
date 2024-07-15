import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizzes } from "../../Data.jsx";
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import api from '../../services/api.js';

const initialQuiz = {
    naziv: "No Quiz",
    rezultati: [],
    vprasanja: []
}

function Kviz() {
    const { id } = useParams(); // Get the quiz id from the URL parameters
    //const quiz = quizzes.find(quiz => quiz.id === parseInt(id)); // Find the quiz data based on the id
    const [currentQuiz, setCurrentQuiz] = useState(initialQuiz);
    const [sidebarOpen, setSidebarOpen] = useState(false); // tu je blo prej initialfalsequiz al nekaj takega??
    const [quizResult, setQuizResult] = useState(0); // State to hold the quiz result percentage

    useEffect(() => {
        if (id) {
            const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/kviz/id', { id: novId })
                .then(res => {
                    const kviz = res.data;
                    console.log(kviz);
                    setCurrentQuiz(kviz);
                })
                .catch(err => {
                    console.error(err);
            });
        }
    }, [id]);

    // Simulated function to fetch quiz result
    const fetchQuizResult = () => {
        // Replace with actual logic to fetch quiz result from API or localStorage
        /*const result = Math.floor(Math.random() * 100); // Random result for demo
        setQuizResult(result);*/
    };

    // useEffect to fetch quiz result on component mount
    useEffect(() => {
        fetchQuizResult();
    }, []);

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

                        {/* Link to SolveQuiz.jsx */}
                        <a
                            href={`/solveQuiz/${id}`} // Assuming solveQuiz route with quiz id parameter
                            className="block py-2 px-4 text-lg text-blue-700 hover:text-gray-900 mb-4" // Added mb-4 for margin-bottom
                            style={{textDecoration: 'none'}}
                        >
                            Solve Quiz
                        </a>

                        {/* Display quiz result percentage */}
                        {quizResult !== null && (
                            <div className="mb-4"> {/* Added mb-4 for margin-bottom */}
                                <p>Your score: {quizResult}%</p>
                            </div>
                        )}

                        <div className="result">
                            <Link
                                to="/domena/:id"
                                className="btn bg-blue-300 hover:bg-blue-400 text-white"
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

export default Kviz;
