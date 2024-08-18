import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar.jsx';
import Header from '../../partials/Header.jsx';
import DynamicHeader from '../../partials/dashboard/DynamicHeader.jsx';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

const initialQuiz = {
    name: "No Quiz",
    results: [],
    questions: []
}

function SolveQuiz() {
    const { id, domain } = useParams();
    const navigate = useNavigate();
    const [currentQuiz, setCurrentQuiz] = useState(initialQuiz);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (currentQuiz) {
          api.post('/question/ids', { ids: currentQuiz.questions })
            .then(res => {
              const questionsData = res.data;
              setQuestions(questionsData);
              setAnswers(Array(questionsData.length).fill([]));
            })
            .catch(err => {
              console.error(err);
            });
        }
    }, [currentQuiz]);

    const handleSelectAnswer = (optionIndex) => {
        const updatedAnswers = [...answers];
        const selectedOption = questions[currentQuestionIndex].answers[optionIndex].split(';')[0];
        if (updatedAnswers[currentQuestionIndex].includes(selectedOption)) {
            updatedAnswers[currentQuestionIndex] = updatedAnswers[currentQuestionIndex].filter(
                answer => answer !== selectedOption
            );
        } else {
            updatedAnswers[currentQuestionIndex] = [...updatedAnswers[currentQuestionIndex], selectedOption];
        }
        setAnswers(updatedAnswers);
    };

    const handleInputAnswer = (e) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = e.target.value;
        setAnswers(updatedAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleEndQuiz = async () => {
        setLoading(true);
        const score = await calculateScore();
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        await api.post(`/quiz/change-result`, { id: newId, userId: user.email, newValue: score });
        
        setLoading(false);
        navigate(`/quiz/${id}/${domain}?score=${score}`);
    };

    const calculateScore = async () => {
        let totalPoints = 0;
        let maxPoints = 0;
    
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const userAnswer = answers[i];
    
            if (!userAnswer || userAnswer.length === 0) {
                continue;
            }
    
            if (question.type === 'closed') {
                const correctAnswersArray = question.answers
                    .filter(answer => answer.split(';')[1] === "true")
                    .map(answer => answer.split(';')[0]);
    
                const correctCount = userAnswer.filter(answer => correctAnswersArray.includes(answer)).length;
                const possibleCorrectCount = correctAnswersArray.length;
    
                totalPoints += (correctCount / possibleCorrectCount);
                maxPoints += 1;    
            } else if (question.type === 'open') {
                await api.post('/quiz/check-answer', { query: question.question, rightAnswer: question.answers[0], answer: userAnswer })
                .then(res => {
                    if (res.data === true) {
                        totalPoints += 1;
                    }
                })
                .catch(err => {
                    console.error(err);
                });
                maxPoints += 1;
            }
        }
        let score = 0;
        if (totalPoints != 0) {
            score = Math.round((totalPoints / maxPoints) * 100);
        }
        return score;
    };
    

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Main Header */}
                        <DynamicHeader domainName={` ${currentQuiz?.name}`} />

                        {/* Quiz Content */}
                        <div className="mt-8">
                            {/* Quiz Question */}
                            {questions.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2 dark:text-slate-100">
                                        Q: {questions[currentQuestionIndex].question}
                                    </h3>
                                    {questions[currentQuestionIndex].type === 'closed' ? (
                                        <ul className="list-disc pl-6">
                                            {questions[currentQuestionIndex].answers.map(
                                                (option, index) => (
                                                    <li
                                                        key={index}
                                                        className={`mb-2 cursor-pointer ${answers[currentQuestionIndex].includes(option.split(';')[0]) ? 'bg-indigo-200' : ''}`}
                                                        onClick={() => handleSelectAnswer(index)}
                                                    >
                                                        {option.split(';')[0]}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <textarea
                                            rows="4"
                                            className="w-full p-2 border border-gray-300 rounded"
                                            placeholder="Enter your answer..."
                                            value={answers[currentQuestionIndex]}
                                            onChange={handleInputAnswer}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between">
                                <button
                                    className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${
                                        currentQuestionIndex === 0
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    Previous
                                </button>
                                {currentQuestionIndex === questions.length - 1 ? (
                                    <button
                                        className={`btn bg-red-500 hover:bg-red-600 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleEndQuiz}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'End Quiz'}
                                    </button>
                                ) : (
                                    <button
                                        className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${
                                            currentQuestionIndex === questions.length - 1
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SolveQuiz;
