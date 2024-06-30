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
import { quizzes } from "../../Data.jsx";
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
    zaposleni: []
}

function Domena() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentDomain, setCurrentDomain] = useState(initialDomain);
    const [currentUser, setCurrentUser] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState("");

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
    }, [id]);

      const fetchFiles = () => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domena/gradiva', { id: novId })
            .then(res => {
                const gradiva = res.data;
                setFiles(gradiva);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        api.post(`/domena/gradivo`, { id: novId, naziv: selectedFile.name, file: selectedFile })
            .then(res => {
                fetchFiles();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileDelete = (fileName) => {
        const novId = id.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        console.log("Naziv: ", fileName);
        api.post(`/domena/izbrisi-gradivo`, { id: novId, naziv: fileName })
            .then(res => {
                fetchFiles();
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleFileDownload = (fileName) => {
        // Tukaj lahko dodate logiko za prenos datoteke
        console.log(`Downloading file: ${fileName}`);
        // Na primer, lahko sprožite API klic za prenos datoteke ali karkoli drugega, kar je potrebno.
    }

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
                                        {/*<a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>*/}
                                        {currentUser && (currentUser.vloga == "boss") && (
                                            <button onClick={() => handleFileDelete(fileName)} className="btn bg-red-500 hover:bg-red-600 text-white ml-4">Delete</button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {currentUser && (currentUser.vloga == "boss") && (
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
                        <SeznamKviz quizzes={quizzes} />

                        {currentUser && (currentUser.vloga == "boss") && (
                            <NavLink to={"/addQuiz"}>
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
    id: PropTypes.number,
    naziv: PropTypes.string.isRequired,
    avtor: PropTypes.string.isRequired,
    opis: PropTypes.string
};

export default Domena;
