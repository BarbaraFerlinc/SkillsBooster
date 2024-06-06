import React, { useState } from 'react';
import OpenQuestion from './OpenQuestions.jsx';
import ClosedQuestion from './ClosedQuestions.jsx';

function DodajKviz() {
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({ type: 'open', question: '', answer: '' });

    const handleQuizNameChange = (e) => {
        setQuizName(e.target.value);
    };

    const handleQuestionTypeChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, type: e.target.value, answer: currentQuestion.type === 'closed' ? [] : '' });
    };

    const handleQuestionChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, question: e.target.value });
    };

    const handleAnswerChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, answer: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = currentQuestion.answer.slice();
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, answer: newOptions });
    };

    const addOption = () => {
        setCurrentQuestion({ ...currentQuestion, answer: [...currentQuestion.answer, ''] });
    };

    const handleConfirmQuestion = () => {
        setQuestions([...questions, currentQuestion]);
        setCurrentQuestion({ type: 'open', question: '', answer: '' });
    };

    const handleAddNewQuestion = () => {
        handleConfirmQuestion();
    };

    const handleSubmitQuiz = () => {
        // Handle the final quiz submission logic here
        console.log({ quizName, questions });
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Quiz Name:</label>
                <input
                    type="text"
                    value={quizName}
                    onChange={handleQuizNameChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            {questions.map((q, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                    <h3 className="font-semibold">{q.question}</h3>
                    {q.type === 'open' ? (
                        <p>{q.answer}</p>
                    ) : (
                        <ul className="list-disc pl-4">
                            {q.answer.map((option, i) => (
                                <li key={i}>{option}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Question Type:</label>
                <select
                    value={currentQuestion.type}
                    onChange={handleQuestionTypeChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            {currentQuestion.type === 'open' ? (
                <OpenQuestion
                    question={currentQuestion.question}
                    answer={currentQuestion.answer}
                    onQuestionChange={handleQuestionChange}
                    onAnswerChange={handleAnswerChange}
                />
            ) : (
                <ClosedQuestion
                    question={currentQuestion.question}
                    options={currentQuestion.answer}
                    onQuestionChange={handleQuestionChange}
                    onOptionChange={handleOptionChange}
                    addOption={addOption}
                />
            )}
            <button
                onClick={handleConfirmQuestion}
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded mt-4"
            >
                Confirm Question
            </button>
            <button
                onClick={handleAddNewQuestion}
                className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4 ml-4"
            >
                Add New Question
            </button>
            <button
                onClick={handleSubmitQuiz}
                className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 ml-4"
            >
                Submit Quiz
            </button>
        </div>
    );
}

export default DodajKviz;
