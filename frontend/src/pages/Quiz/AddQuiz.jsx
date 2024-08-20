import React, { useEffect, useState } from 'react';
import OpenQuestion from './OpenQuestions.jsx';
import ClosedQuestion from './ClosedQuestions.jsx';
import { useParams, useNavigate } from "react-router-dom";
import api from '../../services/api.js';

const initialDomain = {
    key_skills: "",
    quizzes: [],
    lastnik: "",
    name: "No Domain",
    description: "",
    results: [],
    employees: [],
    learning_materials: []
}

function AddQuiz() {
    const { domain } = useParams();
    const navigate = useNavigate();
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({ type: 'open', question: '', answer: '' });
    const [currentDomain, setCurrentDomain] = useState(initialDomain);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (domain) {
            const newId = domain.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/domain/id', { id: newId })
                .then(res => {
                    const domainData = res.data;
                    setCurrentDomain(domainData);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [domain]);

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
        if (validateQuestion()){
            setQuestions([...questions, currentQuestion]);
            setCurrentQuestion({ type: 'open', question: '', answer: '' });
        }
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.slice();
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const validateQuestion = () => {
        let formErrors = {};
        let formIsValid = true;
    
        if (!currentQuestion.question) {
            formIsValid = false;
            formErrors["question"] = "Question is required.";
        }
    
        if (currentQuestion.type === 'closed') {
            if (!currentQuestion.answer || currentQuestion.answer.length === 0) {
                formIsValid = false;
                formErrors["options"] = "At least one option is required.";
            } else {
                let hasCorrectAnswer = false;
                currentQuestion.answer.forEach((option, index) => {
                    if (!option.text) {
                        formIsValid = false;
                        formErrors[`option_${index}`] = `Text is required.`;
                    }
                    if (option.isCorrect === 'true') {
                        hasCorrectAnswer = true;
                    }
                });

                if (!hasCorrectAnswer) {
                    formIsValid = false;
                    formErrors["correct"] = "There must be at least one correct answer.";
                }
            }
        } else if (currentQuestion.type === 'open' && !currentQuestion.answer) {
            formIsValid = false;
            formErrors["answer"] = "Answer is required";
        }
    
        setErrors(formErrors);
        return formIsValid;
    }

    const validateQuiz = () => {
        let formErrors = {};
        let formIsValid = true;
    
        if (!quizName) {
            formIsValid = false;
            formErrors["name"] = "Quiz name is required.";
        }

        if (questions.length === 0) {
            formIsValid = false;
            formErrors["questions"] = "You must add at least one question.";
        }
    
        setErrors(formErrors);
        return formIsValid;
    }

    const handleSubmitQuiz = async () => {
        if (validateQuiz()){
            setLoading(true);
            const newId = quizName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const questionsData = addQuestions(newId);
            const questionsId = [];

            for (const q of questionsData) {
                questionsId.push(`${newId}_${q.question.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`);
                await api.post(`/question/add`, q);
            }

            await api.post(`/quiz/add`, { name: quizName, questions: questionsId });
            await api.post(`/domain/add-quiz`, { id: domain, quizId: newId });

            for (const userId of currentDomain.employees) {
                await api.post(`/quiz/add-result`, { id: newId, userId: userId });
            }

            setLoading(false);
            navigate(`/domain/${domain}`);
        }
    };

    const handleCancel = () => {
        navigate(`/domain/${domain}`);
    };

    const addQuestions = (quizId) => {
        return questions.map(question => {
            let answers;
            if (question.type === "open") {
                answers = [question.answer];
            } else {
                answers = question.answer.map(answer => `${answer.text};${answer.isCorrect}`);
            }

            return {
                question: question.question,
                type: question.type,
                quiz: quizId,
                answers: answers
            };
        });
    };

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
                    <small className="text-red-500">{errors.name}</small>
                </div>
                {questions.map((q, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 relative">
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
                        <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
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
                        error={errors.question}
                    />
                ) : (
                    <ClosedQuestion
                        question={currentQuestion.question}
                        options={currentQuestion.answer}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        addOption={addOption}
                        onAnswerTypeChange={handleAnswerTypeChange}
                        error={errors.question}
                    />
                )}
                <small className="text-red-500">{errors.options}</small>
                {currentQuestion.type === 'closed' && currentQuestion.answer.map((_, index) => (
                    <small key={index} className="text-red-500">{errors[`option_${index}`]}</small>
                ))}
                <small className="text-red-500">{errors.answer}</small>
                <small className="text-red-500">{errors.correct}</small>
                <small className="text-red-500">{errors.questions}</small>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleConfirmQuestion}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
                    >
                        Confirm Question
                    </button>
                    <button
                        onClick={handleSubmitQuiz}
                        className={`bg-green-500 text-white py-2 px-5 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submit Quiz' : 'Submit Quiz'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white py-2 px-5 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddQuiz;
