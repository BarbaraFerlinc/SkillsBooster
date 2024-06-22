import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar.jsx';
import Header from '../../partials/Header.jsx';
import DynamicHeader from '../../partials/dashboard/DynamicHeader.jsx';
import { quizzes } from '../../Data.jsx';

function SolveQuiz() {
    const { id } = useParams(); // Get the quiz id from URL parameters
    const [quiz] = useState(quizzes.find(q => q.id === parseInt(id))); // Find the quiz data based on id
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to track current question index
    const [answers, setAnswers] = useState(Array(quiz.questions.length).fill('')); // State to store user answers

    // Function to handle selecting an answer for closed questions
    const handleSelectAnswer = (optionIndex) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = quiz.questions[currentQuestionIndex].options[optionIndex];
        setAnswers(updatedAnswers);
    };

    // Function to handle inputting an answer for open questions
    const handleInputAnswer = (e) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = e.target.value;
        setAnswers(updatedAnswers);
    };

    // Function to go to the next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Function to go to the previous question
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Function to end the quiz
    const handleEndQuiz = () => {
        // Calculate score (for demo, just count correct answers)
        const score = calculateScore();
        // Redirect or navigate to the quiz results page or another component with the score
        // Example: You can use <Link> or any navigation method you prefer
        // Replace `/quiz/${id}` with your desired endpoint
        console.log(`/quiz/${id}`);
        // Navigate to the result page or any desired endpoint
        window.location.href = `/quiz/${id}?score=${score}`;
    };

    // Function to calculate the score
    const calculateScore = () => {
        let correctAnswers = 0;
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            const userAnswer = answers[i];
            if (question.type === 'closed' && userAnswer === question.correctAnswer) {
                correctAnswers++;
            }
            // You can add more logic here for scoring open questions if needed
        }
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
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
                        <DynamicHeader domainName={`Solve Quiz: ${quiz?.name}`} />

                        {/* Quiz Content */}
                        <div className="mt-8">
                            {/* Quiz Title */}
                            <h2 className="text-2xl font-bold mb-4">{quiz?.name}</h2>

                            {/* Quiz Question */}
                            {quiz.questions.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {quiz.questions[currentQuestionIndex].question}
                                    </h3>
                                    {quiz.questions[currentQuestionIndex].type === 'closed' ? (
                                        <ul className="list-disc pl-6">
                                            {quiz.questions[currentQuestionIndex].options.map(
                                                (option, index) => (
                                                    <li
                                                        key={index}
                                                        className="mb-2 cursor-pointer"
                                                        onClick={() => handleSelectAnswer(index)}
                                                    >
                                                        {option}
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
                                {currentQuestionIndex === quiz.questions.length - 1 ? (
                                    <button
                                        className="btn bg-red-500 hover:bg-red-600 text-white"
                                        onClick={handleEndQuiz}
                                    >
                                        End Quiz
                                    </button>
                                ) : (
                                    <button
                                        className={`btn bg-indigo-500 hover:bg-indigo-600 text-white ${
                                            currentQuestionIndex === quiz.questions.length - 1
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === quiz.questions.length - 1}
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
