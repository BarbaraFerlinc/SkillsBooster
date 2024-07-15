import React, { useEffect, useState } from 'react';
import OpenQuestion from './OpenQuestions.jsx';
import ClosedQuestion from './ClosedQuestions.jsx';
import {useParams} from "react-router-dom";
import api from '../../services/api.js';

function DodajKviz() {
    const { domain } = useParams(); // Get the quiz id from URL parameters
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({ type: 'open', question: '', answer: '' });
    const [questionAdded, setQuestionAdded] = useState(false);
    const [quizzes, setQuizzes] = useState([]);

    const handleQuizNameChange = (e) => {
        setQuizName(e.target.value);
    };

    const handleQuestionTypeChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, type: e.target.value, answer: e.target.value === 'closed' ? [] : '' });
    };

    const handleQuestionChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, question: e.target.value });
    };

    const handleAnswerChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, answer: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = currentQuestion.answer.slice();
        newOptions[index] = { ...newOptions[index], text: value };
        setCurrentQuestion({ ...currentQuestion, answer: newOptions });
    };

    const handleAnswerTypeChange = (index, value) => {
        const newOptions = currentQuestion.answer.slice();
        newOptions[index] = { ...newOptions[index], isCorrect: value };
        setCurrentQuestion({ ...currentQuestion, answer: newOptions });
    };

    const addOption = () => {
        setCurrentQuestion({ ...currentQuestion, answer: [...currentQuestion.answer, { text: '', isCorrect: 'false' }] });
    };

    const handleConfirmQuestion = () => {
        setQuestions([...questions, currentQuestion]);
        setCurrentQuestion({ type: 'open', question: '', answer: '' });
        setQuestionAdded(true);
    };

    useEffect(() => {
        console.log(questions);
        setQuestionAdded(false);
    }, [domain, questionAdded]);


    const handleSubmitQuiz = async () => {
        const novId = quizName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const vprasanja = dodajVprasanja(novId);
        const vprasanjaId = [];

        vprasanja.forEach(async q => {
            vprasanjaId.push(`${novId}_${q.vprasanje.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`);

            await api.post(`/vprasanje/dodaj`, q);
        })
        console.log(vprasanjaId);
        
        await api.post(`/kviz/dodaj`, { naziv: quizName, vprasanja: vprasanjaId });
        console.log('Dodan kviz: ', quizName);
        
        await api.post(`/domena/dodaj-kviz`, { id: domain, kvizId: novId });
        console.log('Kviz dodan v domeno.');

        window.location.href = `/domena/${domain}`;
    };

    const dodajVprasanja = (kvizId) => {
        let vprasanja = [];
        questions.forEach(question => {
            let odgovori;
            if (question.type === "open") {
                odgovori = [question.answer];
            } else {
                odgovori = question.answer.map(answer => `${answer.text};${answer.isCorrect}`);
            }

            const vprasanje = {
                vprasanje: question.question,
                tip: question.type,
                kviz: kvizId,
                odgovori: odgovori
            }

            console.log(vprasanje);
            vprasanja.push(vprasanje);
        });
        console.log(vprasanja);
        return vprasanja;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Quiz</h2>
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-2">Quiz Name:</label>
                    <input
                        type="text"
                        value={quizName}
                        onChange={handleQuizNameChange}
                        className="w-full p-3 border border-gray-300 rounded"
                        placeholder="Enter the name of the quiz"
                    />
                </div>
                {questions.map((q, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="font-semibold">{q.question}</h3>
                        {q.type === 'open' ? (
                            <p>{q.answer}</p>
                        ) : (
                            <ul className="list-disc pl-4">
                                {q.answer.map((option, i) => (
                                    <li key={i} className={option.isCorrect === 'true' ? 'text-green-500' : ''}>{option.text}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-2">Question Type:</label>
                    <select
                        value={currentQuestion.type}
                        onChange={handleQuestionTypeChange}
                        className="w-full p-3 border border-gray-300 rounded"
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
                        onAnswerTypeChange={handleAnswerTypeChange}
                    />
                )}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleConfirmQuestion}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
                    >
                        Confirm Question
                    </button>
                    <button
                        onClick={handleSubmitQuiz}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                        Submit Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DodajKviz;
