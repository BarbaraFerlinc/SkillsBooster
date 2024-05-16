import React, { useState } from 'react';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import reading from "../../images/read-svgrepo-com.png";
import writing from "../../images/writing-svgrepo-com.png";
import PropTypes from "prop-types";

function Domena() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
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
                        <DynamicHeader domainName={"Domena"}/>

                        {/* Secondary Header */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <img src={reading} alt="Icon" className="w-10 h-10 mr-2"/> {/* Increase width and height */}
                                <h3 className="text-lg font-semibold text-gray-800">Gradivo</h3>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleFileChange}
                            id="fileInput"
                            multiple
                        />
                        <label htmlFor="fileInput" className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer">
                            <span className="hidden xs:block ml-2">Dodaj gradivo</span>
                        </label>
                        <div>
                            {files.map((file, index) => (
                                <div key={index}>
                                    <a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <img src={writing} alt="Icon" className="w-10 h-10 mr-2"/>
                                <h3 className="text-lg font-semibold text-gray-800">Kvizi</h3>
                            </div>
                        </div>
                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                            <span className="hidden xs:block ml-2">Ustvari kviz</span>
                        </button>
                        {/* Cards */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Your cards content here */}
                        </div>
                    </div>
                </main>
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
