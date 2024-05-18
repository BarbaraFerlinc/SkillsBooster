import React, { useState } from 'react';
import { quizData } from "../../Data.jsx";
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import {NavLink} from "react-router-dom";

function Kviz() {
    const [answers, setAnswers] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showQuestions, setShowQuestions] = useState(true);
    const [successRate, setSuccessRate] = useState(null);


    const handleAnswer = (questionId, selectedAnswer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedAnswer
        }));
    };
    const calculateScore = () => {
        const totalQuestions = quizData.questions.length;
        const correctAnswers = Object.entries(answers).reduce((acc, [questionId, selectedAnswer]) => {
            const correctAnswer = quizData.questions.find(question => question.id === questionId)?.correctAnswer;
            return correctAnswer === selectedAnswer ? acc + 1 : acc;
        }, 0);
        return Math.round((correctAnswers / totalQuestions) * 100);
    };


    const handleFinishTest = () => {
        setShowQuestions(false);
        setSuccessRate(calculateScore());
    };


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
                        <DynamicHeader domainName={"Kviz"}/>
                        <h1 className="text-lg font-semibold text-slate-800 mb-2">{quizData.name}</h1>
                        {showQuestions && (
                            <div className="questions">
                                {quizData.questions.map(question => (
                                    <div key={question.id} className="question">
                                        <p>{question.question}</p>
                                        <input
                                            type="text"
                                            value={answers[question.id] || ''}
                                            onChange={e => handleAnswer(question.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-8" onClick={handleFinishTest}>Finish Test</button>
                            </div>
                        )}
                        {successRate !== null && (
                            <div className="result">
                                <p>Success Rate: {successRate}%</p>
                                <NavLink to="/domena"
                                         className="btn bg-blue-300 hover:bg-blue-400 text-white"> {/* Change bg-green-500 to bg-blue-300 */}
                                    Nazaj
                                </NavLink>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Kviz;