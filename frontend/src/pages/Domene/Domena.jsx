import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import reading from "../../images/read-svgrepo-com.png";
import writing from "../../images/writing-svgrepo-com.png";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import SeznamKviz from "../Kviz/SeznamKviz.jsx";
//import { quizzes } from "../../Data.jsx";
import AIAssistant from "../../partials/AIAssistant.jsx"; // Make sure to adjust the path according to your project structure
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

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

function Domena() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState(initialDomain);
    const [currentUser, setCurrentUser] = useState(null);
    const [fileAdded, setFileAdded] = useState(false);
    const [files, setFiles] = useState([]);
    const [quizDeleted, setQuizDeleted] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [quiz, setQuiz] = useState(null);

    const { id } = useParams();
    const { user } = UserAuth();

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
            .then(res => {
                const kvizi = res.data;
                setQuizzes(kvizi);
                setQuizDeleted(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        api.post(`/domena/dodaj-gradivo`, { id: novId, naziv: selectedFile.name, file: selectedFile })
            .then(res => {
                setFileAdded(true);
                //window.location.reload();
            })
            .catch(err => {
                console.error(err);
            });
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

    /*function getMimeType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'pdf':
                return 'application/pdf';
            case 'txt':
                return 'text/plain';
            case 'html':
                return 'text/html';
            default:
                return 'application/octet-stream';
        }
    }*/

    const handleFileDownload = (fileName) => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        console.log(`Downloading file: ${fileName} from ${novId}`);

        //const mimeType = getMimeType(fileName);
        //window.open(fileUrl);
        /*api.post(`/domena/beri-gradivo`, { id: novId, naziv: fileName })
            .then(res => {
                console.log('File fetched successfully:', res);
                // Do something with the blob, e.g., display it, download it, etc.
                const blob = new Blob([res.data], { type: res.data.type });

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error fetching file:', error);
            });*/
    }

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

                        {/* Gradivo Section */}
                        <div className="flex items-center justify-between mt-8">
                            <div className="flex items-center">
                                <img src={reading} alt="Icon" className="w-16 h-16 mr-4" />
                                <h3 className="text-xl font-bold text-gray-800">Files</h3>
                            </div>
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
                                files.map((fileName, index) => (
                                    <div key={index}>
                                        
                                        <a href="#" onClick={() => handleFileDownload(fileName)}>{fileName}</a>
                                        {/*<a href={URL.createObjectURL(file.url)} download={file.naziv}>{file.naziv}</a>*/}
                                        {currentUser && (currentUser.vloga === "boss") && (
                                            <button onClick={() => handleFileDelete(fileName)} className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {currentUser && (currentUser.vloga === "boss") && (
                            <label htmlFor="fileInput" className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer mt-8">
                                <span className="hidden xs:block ml-2">Add file</span>
                            </label>
                        )}
                        

                        {/* Kvizi Section */}
                        <div className="flex items-center justify-between mt-8">
                            <div className="flex items-center">
                                <img src={writing} alt="Icon" className="w-16 h-16 mr-4" />
                                <h3 className="text-xl font-bold text-gray-800">Quizes</h3>
                            </div>
                        </div>

                        {/* SeznamKvizov Component */}
                        {/*<SeznamKviz quizzes={quizzes} domain={id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} />*/}

                        {quizzes.map((quiz, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <NavLink
                                        to={`/quiz/${quiz}`}
                                        className="text-md font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 text-black hover:text-black truncate"
                                    >
                                        {quiz}
                                    </NavLink>
                                    {currentUser && (currentUser.vloga === "boss") && (
                                        <button 
                                            onClick={() => handleQuizDelete(quiz)} 
                                            className="btn bg-red-500 hover:bg-red-600 text-white ml-4"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}

                        {currentUser && (currentUser.vloga == "boss") && (
                            <NavLink to={`/addQuiz/${id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`}>
                                <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-8">
                                    <span className="hidden xs:block ml-2">Add quiz</span>
                                </button>
                            </NavLink>
                        )}
                    </div>
                </main>
                <AIAssistant />
            </div>
        </div>
    );
}

Domena.propTypes = {
    kljucna_znanja: PropTypes.string,
    kvizi: PropTypes.arrayOf(PropTypes.string),
    lastnik: PropTypes.string,
    naziv: PropTypes.string.isRequired,
    opis: PropTypes.string,
    rezultati: PropTypes.arrayOf(PropTypes.string),
    zaposleni: PropTypes.arrayOf(PropTypes.string),
    gradiva: PropTypes.arrayOf(PropTypes.string)
};

export default Domena;
