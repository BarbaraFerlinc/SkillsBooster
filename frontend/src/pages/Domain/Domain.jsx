import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import reading from "../../images/read-svgrepo-com.png";
import writing from "../../images/writing-svgrepo-com.png";
import score from "../../images/score-svgrepo-com.png";
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
    const [linkName, setLinkName] = useState('');
    const [link, setLink] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState(initialDomain);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileAdded, setFileAdded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState('');
    const [linkDeleted, setLinkDeleted] = useState(false);
    const [links, setLinks] = useState([]);
    const [quizDeleted, setQuizDeleted] = useState(false);
    const [domainQuizzes, setDomainQuizzes] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadMaterial, setLoadMaterial] = useState(false);
    const [loadLink, setLoadLink] = useState(false);
    const [showModelMessage, setShowModelMessage] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [quizStatuses, setQuizStatuses] = useState([]);
    const navigate = useNavigate();

    const {id} = useParams();
    const {user} = UserAuth();
    const {currentTheme} = useThemeProvider();

    useEffect(() => {
        if (id) {
            const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post('/domain/id', {id: newId})
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

            api.post('/user/id', {id: userEmail})
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
        if (currentUser && domainQuizzes.length > 0) {
            const fetchStatuses = async () => {
                const statuses = {};
                for (const quiz of domainQuizzes) {
                    try {
                        const response = await api.post('/quiz/find-status', { id: quiz, userId: currentUser.email });
                        statuses[quiz] = response.data;
                    } catch (error) {
                        console.error(`Error fetching status for quiz ${quiz}:`, error);
                        statuses[quiz] = 'unknown';
                    }
                }
                setQuizStatuses(statuses);
                console.log(statuses);
            };
            fetchStatuses();
        }
    }, [domainQuizzes, currentUser]);

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
        api.post('/domain/materials', {id: newId})
            .then(res => {
                const materials = res.data;
                setFiles(materials);
                setFileAdded(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchLinks = () => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domain/links', {id: newId})
            .then(res => {
                const linksData = res.data;
                setLinks(linksData);
                setLinkDeleted(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchQuizzes = () => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domain/quizzes', {id: newId})
            .then(async res => {
                const quizzesData = res.data;
                const response = await api.post('/quiz/ids', {ids: quizzesData});
                setDomainQuizzes(quizzesData);
                setQuizzes(response.data);
                setQuizDeleted(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileChange = async (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileInputChange = (e) => {
        setFileName(e.target.value);
    };

    const validateFileForm = () => {
        let formErrors = {};
        let formIsValid = true;

        if (!fileName) {
            formIsValid = false;
            formErrors["fileName"] = "Please add file name";
        }

        if (selectedFile == null) {
            formIsValid = false;
            formErrors["file"] = "Please add file";
        }

        setErrors(formErrors);
        return formIsValid;
    }

    const handleConfirm = () => {
        setLoadMaterial(true);
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        if (validateFileForm()) {
            const formData = new FormData();
            formData.append('id', newId);
            formData.append('name', fileName);
            formData.append('link', selectedFile.name);
            formData.append('file', selectedFile);

            api.post('/domain/add-material', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(() => {
                    setFileAdded(true);
                    setShowCard(false);
                    setLoadMaterial(false);
                }).catch(err => {
                console.error(err);
            });
        }
        setLoadMaterial(false);
    };

    const handleCancel = () => {
        setShowCard(false);
    };

    const handleFileDownload = (fileName) => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/read-material`, {id: newId, name: fileName})
            .then(res => {
                window.open(res.data, '_blank');
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleFileDelete = (fileName) => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/delete-material`, {id: newId, name: fileName})
            .then(res => {
                setFileAdded(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleAddLinkClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (e) => {
        setLink(e.target.value);
    };

    const handleNameInputChange = (e) => {
        setLinkName(e.target.value);
    };
    
    const validateLinkForm = () => {
        let formErrors = {};
        let formIsValid = true;

        if (!linkName) {
            formIsValid = false;
            formErrors["linkName"] = "Please add link name";
        }

        if (!link) {
            formIsValid = false;
            formErrors["link"] = "Please add link";
        }

        setErrors(formErrors);
        return formIsValid;
    }

    const handleConfirmLink = () => {
        setLoadLink(true);
        if (validateLinkForm()){
            const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            api.post(`/domain/add-link`, { id: newId, name: linkName, link: link })
                .then(res => {
                    setLinkDeleted(true);
                    setLinkName('')
                    setLink('');
                    setShowInput(false);
                    setLoadLink(false);
                })
                .catch(err => {
                    console.error(err);
                });
        }
        setLoadLink(false);
    };

    const handleOpenLink = async (link) => {
        window.open(link.split('|')[1], '_blank');
    };

    const handleLinkDelete = async (link) => {
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/delete-link`, {id: newId, name: link})
            .then(res => {
                setLinkDeleted(true);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleQuizDelete = async (quizName) => {
        const quizId = quizName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post(`/domain/delete-quiz`, {id: newId, quizId: quizId})
            .then(res => {
                setQuizDeleted(true);
            })
            .catch(err => {
                console.error(err);
            });

        await api.post('/quiz/id', {id: quizId})
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
        setLoading(true);
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const payload = {
            id: newId,
            nameDomain: newId
        };

        api.post(`/domain/update-model`, payload)
            .then(res => {
                console.log(res.data);
                setLoading(false);
                setShowModelMessage(true);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    };

    const handleCloseModelMessage = () => {
        setShowModelMessage(false);
    };

    const handleCloseDeleteMessage = () => {
        setShowDeleteMessage(false);
    };

    const handleDeleteDomain = () => {
        setLoading(true);
        const newId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        api.delete(`/domain/${newId}`)
            .then(() => {
                setLoading(false);
                setShowDeleteMessage(true);
                navigate('/profile');
            })
            .catch(err => {
                console.error('Error deleting domain:', err);
                setLoading(false);
            });
    };

    const textClass = currentTheme === 'dark' ? 'text-white' : 'text-black';
    const subTextClass = currentTheme === 'dark' ? 'text-white' : 'text-black';

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

                <main className={`${currentUser?.role == 'employee' ? 'pb-20' : ''}`}>
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

                        {/* Files & Links Section */}
                        <div className="mt-8">
                            <div className="flex items-center">
                                <img src={reading} alt="Icon" className="w-16 h-16 mr-4"/>
                                <h3 className={`text-xl font-bold ${textClass}`}>Learning material</h3>
                            </div>


                            <div className="gap-6 mt-4">
                                {files.length === 0 ? (
                                    <p>No files</p>
                                ) : (
                                    <ul>
                                        {files.map((fileName, index) => (
                                            <li key={index}
                                                className={`flex items-center justify-between mb-2 ${subTextClass}`}>
                                                <a href="#"
                                                    onClick={() => handleFileDownload(fileName)}>{fileName.split(';')[0]}</a>
                                                {currentUser && (currentUser.role === "manager") && (
                                                    <button onClick={() => handleFileDelete(fileName)}
                                                            className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {currentUser && (currentUser.role === "manager") && (
                                <div>
                                    <button
                                        onClick={() => setShowCard(true)}
                                        className="btn bg-indigo-500 text-white py-2 px-5 rounded"
                                    >
                                        <span className="ml-2">Add file</span>
                                    </button>

                                    {showCard && (
                                        <div className="card border p-4 mt-4 rounded shadow-md">
                                            <input
                                                type="text"
                                                placeholder="Name your file"
                                                className="border p-2 w-full mb-2"
                                                value={fileName}
                                                onChange={handleFileInputChange}

                                            />
                                            <input
                                                type="file"
                                                className=" p-2 w-full mb-2"
                                                onChange={handleFileChange}
                                                id="fileInput"
                                            />
                                            <div>
                                                <button
                                                    onClick={handleCancel}
                                                    className="btn bg-red-500 text-white py-2 px-4 rounded "
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleConfirm}
                                                    className={`btn bg-green-500 text-white py-2 px-4 rounded ml-2 ${loadMaterial ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={loadMaterial}
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                            <small className="text-red-500">{errors.fileName}</small>
                                            <br/>
                                            <small className="text-red-500">{errors.file}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center mt-8">
                                <img src={score} alt="Icon" className="w-16 h-16 mr-4"/>
                                <h4 className={`text-xl font-bold ${textClass}`}>Extra Resources</h4>
                            </div>
                            <div className="gap-6 mt-4">
                                {links.length === 0 ? (
                                    <p>No links</p>
                                ) : (
                                    <ul>
                                        {links.map((link, index) => (
                                            <li key={index}
                                                className={`flex items-center justify-between mb-2 ${subTextClass}`}>
                                                <a href="#"
                                                    onClick={() => handleOpenLink(link)}>{link.split('|')[0]}</a>
                                                {currentUser && (currentUser.role === "manager") && (
                                                    <button onClick={() => handleLinkDelete(link)}
                                                            className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {currentUser && (currentUser.role === "manager") && (
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
                                                    value={linkName}
                                                    onChange={handleNameInputChange}
                                                    placeholder="Link Name"
                                                    className="border p-2 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    value={link}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your link"
                                                    className="border p-2 rounded  ml-2"
                                                />
                                                <button
                                                    className="ml-2 btn bg-red-500 text-white py-2 px-3 rounded"
                                                    onClick={() => {
                                                        setShowInput(false);
                                                        setLink('');
                                                        setLinkName('');
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleConfirmLink}
                                                    className={`ml-2 btn bg-green-500 text-white py-2 px-3 rounded ${loadLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={loadLink}
                                                >
                                                    Confirm
                                                </button>

                                            </div>
                                            <small className="text-red-500">{errors.linkName}</small>
                                            <br/>
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
                                                className={`flex items-center ${subTextClass}`}
                                            >
                                                {quiz.name}
                                            </NavLink>
                                            {currentUser && currentUser.role === "employee" && (
                                                <button
                                                    disabled={true}
                                                    className={`btn ${quizStatuses[quiz.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] === 'solved' ? 'bg-lime-600' : 'bg-sky-700'} text-white ml-4 w-24 h-10 flex items-center justify-center`}
                                                >
                                                    {quizStatuses[quiz.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] === 'solved' ? (
                                                        <>
                                                            <span className="mr-2">&#10003;</span> Solved
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="mr-2">&#10007;</span> Unsolved
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            {console.log(quizStatuses[quiz.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()])}
                                            {currentUser && currentUser.role === "manager" && (
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


                            {currentUser && (currentUser.role === "manager") && (
                                <NavLink
                                    to={`/addQuiz/${id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}>
                                    <button className=" btn bg-indigo-500 text-white py-2 px-5 rounded">
                                        <span className="ml-2">Add Quiz</span>
                                    </button>
                                </NavLink>
                            )}

                            {currentUser && (currentUser.role === "manager") && (
                                <div className='mt-16 w-full'>
                                    <p className='mb-4 text-gray-500 text-justify'>
                                        The Update Model button is used to refresh the AI model. When you press this
                                        button, the system retrieves all uploaded training materials and retrains
                                        the model
                                        based on them. Since this process is resource-intensive and can take some
                                        time, it’s
                                        recommended to use the button sparingly, preferably at night when the system
                                        is less busy.
                                    </p>
                                    <button onClick={() => handleUpdateModel()}
                                            className={`btn bg-green-500 text-white py-2 px-5 rounded ${loading || showModelMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={loading || showModelMessage}
                                    >
                                        Update Model
                                    </button>
                                </div>
                            )}
                            {showModelMessage && (
                                <div
                                    className="mt-4 p-4 bg-green-200 text-green-800 rounded-md flex justify-between items-center">
                                    <span>Model successfully updated! It is recommended not to update the model again for at least 30 minutes.</span>
                                    <button onClick={handleCloseModelMessage} className="btn btn-primary ml-4">
                                        OK
                                    </button>
                                </div>
                            )}

                            {currentUser && currentUser.role === "manager" && (
                                <div className="mt-16 w-full">

                                        <div className="flex items-center mb-4">
                                            <h3 className={`text-xl font-bold ${textClass}`}>Danger Zone</h3>
                                        </div>
                                    <p className="mb-4 text-gray-500 text-justify ">
                                        If you wish to delete this Knowledge Domain, click the button below.
                                    </p>
                                    <button
                                        onClick={handleDeleteDomain}
                                        className={`btn bg-red-500 text-white py-2 px-5 rounded ${loading || showDeleteMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading || showDeleteMessage || showModelMessage}
                                    >
                                        Delete Domain
                                    </button>
                                </div>
                            )}
                            {showDeleteMessage && (
                                <div className="mt-4 p-4 bg-green-200 text-green-800 rounded-md flex justify-between items-center">
                                    <span>Knowledge Domain has been deleted.</span>
                                    <button onClick={handleCloseDeleteMessage} className="btn btn-primary ml-4">
                                        OK
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {currentUser && currentUser.role === "employee" && (
                        <AIAssistant
                            domain={currentDomain.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}/>
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
