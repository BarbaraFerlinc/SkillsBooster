import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import reading from "../../images/read-svgrepo-com.png";
import writing from "../../images/writing-svgrepo-com.png";
import PropTypes from "prop-types";
import AIAssistant from "../../partials/AIAssistant.jsx";
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import { useThemeProvider } from '../../utils/ThemeContext.jsx';

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

function Domain() {
    const [showInput, setShowInput] = useState(false);
    const [link, setLink] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState(initialDomain);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileAdded, setFileAdded] = useState(false);
    const [files, setFiles] = useState([]);
    const [linkDeleted, setLinkDeleted] = useState(false);
    const [links, setLinks] = useState([]);
    const [quizDeleted, setQuizDeleted] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [errors, setErrors] = useState({});

    const { id } = useParams();
    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider();

    useEffect(() => {
        if (id) {
            const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/domain/id', { id: newId })
                .then(res => {
                    const domain = res.data;
                    setCurrentDomain(domain);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [id]);

    useEffect(() => {
        if (user) {
            const userEmail = user.email;

            api.post('/user/id', { id: userEmail })
                .then(res => {
                    const profile = res.data;
                    setCurrentUser(profile);
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

    useEffect(() => {
        fetchLinks();
    }, [id, linkDeleted]);

    const fetchFiles = () => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domain/materials', { id: newId })
            .then(res => {
                const materials = res.data;
                setFiles(materials);
                setFileAdded(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchQuizzes = () => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domain/quizzes', { id: newId })
            .then(async res => {
                const quizzesData = res.data;
                const response = await api.post('/quiz/ids', { ids: quizzesData });
                setQuizzes(response.data);
                setQuizDeleted(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchLinks = () => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domain/links', { id: newId })
            .then(res => {
                const linksData = res.data;
                setLinks(linksData);
                setLinkDeleted(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        if (selectedFile) {
            const formData = new FormData();
            formData.append('id', newId);
            formData.append('name', selectedFile.name);
            formData.append('file', selectedFile);

            api.post('/domain/add-material', formData, {
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

    const handleFileDownload = (fileName) => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/read-material`, { id: newId, name: fileName })
            .then(res => {
                window.open(res.data, '_blank');
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleFileDelete = (fileName) => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/delete-material`, { id: newId, name: fileName })
            .then(res => {
                setFileAdded(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleQuizDelete = async (quizName) => {
        const quizId = quizName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/delete-quiz`, { id: newId, quizId: quizId })
            .then(res => {
                setQuizDeleted(true);
            })
            .catch(err => {
                console.error(err);
            });

        await api.post('/quiz/id', { id: quizId })
            .then(res => {
                const quiz = res.data;
                quiz.questions.forEach(question => {
                    api.delete(`/question/${question}`);
                });

                api.delete(`/quiz/${quizId}`);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleUpdateModel = () => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
        // Prepare the payload with newId used twice
        const payload = {
            id: newId,
            nameDomain: newId
        };
    
        // Send the POST request
        api.post(`/domain/update-model`, payload)
            .then(res => {
                console.log(res.data); // Logs the server response
            })
            .catch(err => {
                console.error('Error:', err);
            });
    };
    
    
    const handleAddLinkClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (e) => {
        setLink(e.target.value);
    };

    const validateForm = () => {
        let formErrors = {};
        let formIsValid = true;
    
        if (!link) {
            formIsValid = false;
            formErrors["link"] = "Please add link";
        }
    
        setErrors(formErrors);
        return formIsValid;
      }

    const handleConfirmLink = () => {
        if (validateForm()){
            const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post(`/domain/add-link`, { id: newId, link: link })
                .then(res => {
                    setLinkDeleted(true);
                    setLink('');
            setShowInput(false);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    const handleOpenLink = async (link) => {
        window.open(link, '_blank');
    };

    const handleLinkDelete = async (link) => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/delete-link`, { id: newId, link: link })
            .then(res => {
                setLinkDeleted(true);
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
                        <DynamicHeader domainName={currentDomain.name}/>

                        {/* Domain Description and Key Skills */}
                        <div className="mt-8">
                            <h2 className={`text-xl font-bold ${textClass}`}>Description</h2>
                            <p className={`mt-4 ${subTextClass}`}>{currentDomain.description || "No description available."}</p>
                        </div>
                        <div className="mt-8">
                            <h2 className={`text-xl font-bold ${textClass}`}>Key Skills</h2>
                            <p className={`mt-4 ${subTextClass}`}>{currentDomain.key_skills || "No key skills available."}</p>
                        </div>

                        {currentUser && (currentUser.role === "boss") && (
                            <div className='mt-8'>
                                <button onClick={() => handleUpdateModel()}
                                        className=" btn bg-green-500 text-white py-2 px-5 rounded">Update model</button>
                            </div>
                        )}

                        {/* Files & Links Section */}
                        <div className="mt-8">
                            <div className="flex items-center">
                                <img src={reading} alt="Icon" className="w-16 h-16 mr-4"/>
                                <h3 className={`text-xl font-bold ${textClass}`}>Learning material</h3>
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
                                            <li key={index}
                                                className={`flex items-center justify-between mb-2 ${subTextClass}`}>
                                                <a href="#" onClick={() => handleFileDownload(fileName)}>{fileName}</a>
                                                {currentUser && (currentUser.role === "boss") && (
                                                    <button onClick={() => handleFileDelete(fileName)}
                                                            className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {currentUser && (currentUser.role === "boss") && (
                                <label htmlFor="fileInput"
                                       className="btn bg-indigo-500 text-white py-2 px-5 rounded ">
                                    <span className="ml-2">Add file</span>
                                </label>
                            )}

                            <div className="gap-6 mt-4">
                                {links.length === 0 ? (
                                    <p>No links</p>
                                ) : (
                                    <ul>
                                        {links.map((link, index) => (
                                            <li key={index}
                                                className={`flex items-center justify-between mb-2 ${subTextClass}`}>
                                                <a href="#" onClick={() => handleOpenLink(link)}>{link}</a>
                                                {currentUser && (currentUser.role === "boss") && (
                                                    <button onClick={() => handleLinkDelete(link)}
                                                            className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {currentUser && (currentUser.role === "boss") && (
                                <div>
                                    <button
                                        className="btn bg-indigo-500 text-white py-2 px-5 rounded mt-2"
                                        onClick={handleAddLinkClick}
                                    >
                                        <span className="ml-2">Add Link</span>
                                    </button>

                                    {showInput && (
                                        <>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    value={link}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your link"
                                                    className="border p-2 rounded"
                                                />
                                                <button
                                                    className="ml-2 btn bg-green-500 text-white py-1 px-3 rounded"
                                                    onClick={handleConfirmLink}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    className="ml-2 btn bg-red-500 text-white py-1 px-3 rounded"
                                                    onClick={() => { setShowInput(false); setLink(''); }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            <small className="text-red-500">{errors.link}</small>
                                        </>
                                    )}

                                </div>
                            )}

                        </div>

                        {/* Quizzes Section */}
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
                                                to={`/quiz/${quiz.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}/${id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}
                                                className={`flex items-center justify-between mb-2 ${subTextClass}`}
                                            >
                                                {quiz.name}
                                            </NavLink>
                                            {currentUser && (currentUser.role === "boss") && (
                                                <button
                                                    onClick={() => handleQuizDelete(quiz.name)}
                                                    className="btn bg-red-500 hover:bg-red-600 text-white ml-4"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>

                            {currentUser && (currentUser.role === "boss") && (
                                <NavLink
                                    to={`/addQuiz/${id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}>
                                    <button className=" btn bg-indigo-500 text-white py-2 px-5 rounded">
                                        <span className="ml-2">Add Quiz</span>
                                    </button>
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {currentUser && currentUser.role === "user" && (
                        <AIAssistant domain={currentDomain.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} />
                    )}
                </main>
            </div>
        </div>
    );
}

Domain.propTypes = {
    domainName: PropTypes.string,
};

export default Domain;
