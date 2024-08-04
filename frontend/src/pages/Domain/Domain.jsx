import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import reading from "../../images/read-svgrepo-com.png";
import writing from "../../images/writing-svgrepo-com.png";
import PropTypes from "prop-types";
import AIAssistant from "../../partials/AIAssistant.jsx"; // Adjust the path according to your project structure
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import { useThemeProvider } from '../../utils/ThemeContext.jsx';

const initialDomain = {
    kljucna_znanja: "",
    kvizi: [],
    lastnik: "",
    naziv: "No Domain",
    opis: "",
    rezultati: [],
    zaposleni: [],
    gradiva: []
}

function Domain() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState(initialDomain);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileAdded, setFileAdded] = useState(false);
    const [files, setFiles] = useState([]);
    const [quizDeleted, setQuizDeleted] = useState(false);
    const [quizzes, setQuizzes] = useState([]);

    const { id } = useParams();
    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider(); // Get the current theme

    useEffect(() => {
        if (id) {
            const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/domena/id', { id: novId })
                .then(res => {
                    const domena = res.data;
                    setCurrentDomain(domena);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [id]);

    useEffect(() => {
        if (user) {
            const uporabnikovEmail = user.email;

            api.post('/uporabnik/profil', { id: uporabnikovEmail })
                .then(res => {
                    const profil = res.data;
                    setCurrentUser(profil);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [user]);

    useEffect(() => {
        fetchFiles();
    }, [id, fileAdded]);

    useEffect(() => {
        fetchQuizzes();
    }, [id, quizDeleted]);

    const fetchFiles = () => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domena/gradiva', { id: novId })
            .then(res => {
                const gradiva = res.data;
                setFiles(gradiva);
                setFileAdded(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchQuizzes = () => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domena/kvizi', { id: novId })
            .then(async res => {
                const kvizi = res.data;
                const response = await api.post('/kviz/ids', { ids: kvizi });
                setQuizzes(response.data);
                setQuizDeleted(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const formData = new FormData();
            console.log(selectedFile);
            formData.append('id', novId);
            formData.append('naziv', selectedFile.name);
            formData.append('file', selectedFile);
    
            api.post('/domena/dodaj-gradivo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                setFileAdded(true);
            }).catch(err => {
                console.error(err);
            });
        }
    };

    const handleFileDelete = (fileName) => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domena/izbrisi-gradivo`, { id: novId, naziv: fileName })
            .then(res => {
                setFileAdded(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleQuizDelete = async (quizName) => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const kvizId = quizName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domena/odstrani-kviz`, { id: novId, kvizId: kvizId })
            .then(res => {
                setQuizDeleted(true);
            })
            .catch(err => {
                console.error(err);
            });

        await api.post('/kviz/id', { id: kvizId })
            .then(res => {
                const kviz = res.data;
                kviz.vprasanja.forEach(vprasanje => {
                    api.delete(`/vprasanje/${vprasanje}`);
                });

                api.delete(`/kviz/${kvizId}`);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const textClass = currentTheme === 'dark' ? 'text-white' : 'text-black';
    const subTextClass = currentTheme === 'dark' ? 'text-white' : 'text-black';

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
                        <DynamicHeader domainName={currentDomain.naziv} />

                        {/* Domain Description and Keywords */}
                        <div className="mt-8">
                            <h2 className={`text-xl font-bold ${textClass}`}>Description</h2>
                            <p className={`mt-4 ${subTextClass}`}>{currentDomain.opis || "No description available."}</p>
                        </div>
                        <div className="mt-8">
                            <h2 className={`text-xl font-bold ${textClass}`}>Key Skills</h2>
                            <p className={`mt-4 ${subTextClass}`}>{currentDomain.kljucna_znanja || "No key skills available."}</p>
                        </div>

                        {/* Gradivo Section */}
                        <div className="mt-8">
                            <div className="flex items-center">
                                <img src={reading} alt="Icon" className="w-16 h-16 mr-4" />
                                <h3 className={`text-xl font-bold ${textClass}`}>Files</h3>
                            </div>

                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                id="fileInput"
                            />

                            <div className="gap-6 mt-4">
                                {files.length === 0 ? (
                                    <p>No files</p>
                                ) : (
                                    <ul>
                                        {files.map((fileName, index) => (
                                            <li key={index} className={`flex items-center justify-between mb-2 ${subTextClass}`}>
                                                <a href="#" onClick={() => handleFileDownload(fileName)}>{fileName}</a>
                                                {currentUser && (currentUser.vloga === "boss") && (
                                                    <button onClick={() => handleFileDelete(fileName)}
                                                            className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {currentUser && (currentUser.vloga === "boss") && (
                                <label htmlFor="fileInput"
                                       className="btn bg-indigo-500 text-white py-2 px-5 rounded">
                                    <span className="ml-2">Add file</span>
                                </label>
                            )}
                        </div>

                        {/* Kvizi Section */}
                        <div className="mt-8">
                            <div className="flex items-center">
                                <img src={writing} alt="Icon" className="w-16 h-16 mr-4"/>
                                <h3 className={`text-xl font-bold ${textClass}`}>Quizzes</h3>
                            </div>

                            <ul className="gap-6 mt-4">
                                {quizzes.length === 0 ? (
                                    <p>No quizzes</p>
                                ) : (
                                    quizzes.map((quiz, index) => (
                                        <li key={index} className="flex items-center justify-between mb-2">
                                            <NavLink
                                                to={`/quiz/${quiz.naziv.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}/${id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}
                                                className={`flex items-center justify-between mb-2 ${subTextClass}`}
                                            >
                                                {quiz.naziv}
                                            </NavLink>
                                            {currentUser && (currentUser.vloga === "boss") && (
                                                <button
                                                    onClick={() => handleQuizDelete(quiz.naziv)}
                                                    className="btn bg-red-500 hover:bg-red-600 text-white ml-4"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>

                            {currentUser && (currentUser.vloga === "boss") && (
                                <NavLink to={`/addQuiz/${id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}>
                                    <button className=" btn bg-indigo-500 text-white py-2 px-5 rounded">
                                        <span className="ml-2">Add Quiz</span>
                                    </button>
                                </NavLink>
                            )}
                        </div>
                    </div>
                    <AIAssistant/>
                </main>
            </div>
        </div>
    );
}

Domain.propTypes = {
    domainName: PropTypes.string,
};

export default Domain;
