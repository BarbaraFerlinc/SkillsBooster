import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import reading from "../../images/read-svgrepo-com.png";
import writing from "../../images/writing-svgrepo-com.png";
import SeznamDomen from "./SeznamDomen.jsx";

function DodajDomeno({ onSubmit }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [domainName, setDomainName] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [domains, setDomains] = useState([]);
    const [showForm, setShowForm] = useState(true);

    const handleDomainNameChange = (event) => setDomainName(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);
    const handleAuthorChange = (event) => setAuthor(event.target.value);

    const handleSubmit = () => {
        const newDomena = { id: domains.length + 1, name: domainName, description, author };
        setDomains([...domains, newDomena]);
        onSubmit(newDomena);
        setDomainName("");
        setDescription("");
        setAuthor("");
        setShowForm(false);
    };

    const handleAddNewDomain = () => {
        setShowForm(true);
        setDomainName("");
        setDescription("");
        setAuthor("");
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <DynamicHeader domainName={domainName} />

                        {showForm ? (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Add domain name..."
                                    value={domainName}
                                    onChange={handleDomainNameChange}
                                />

                                <textarea
                                    className="w-full h-32 border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Add description..."
                                    value={description}
                                    onChange={handleDescriptionChange}
                                ></textarea>

                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Add author..."
                                    value={author}
                                    onChange={handleAuthorChange}
                                />

                                <button
                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                    onClick={handleSubmit}
                                >
                                    Add Domena
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                                <p>{description}</p>
                                <h3 className="text-lg font-semibold text-gray-800">Author</h3>
                                <p>{author}</p>
                                <button
                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-4"
                                    onClick={handleAddNewDomain}
                                >
                                    Add New Domain
                                </button>
                            </div>
                        )}

                        <SeznamDomen domains={domains} />

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <img src={reading} alt="Icon" className="w-10 h-10 mr-2"/>
                                <h3 className="text-lg font-semibold text-gray-800">Gradivo</h3>
                            </div>
                        </div>

                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                            <span className="hidden xs:block ml-2">Dodaj gradivo</span>
                        </button>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <img src={writing} alt="Icon" className="w-10 h-10 mr-2"/>
                                <h3 className="text-lg font-semibold text-gray-800">Kvizi</h3>
                            </div>
                        </div>

                        <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                            <span className="hidden xs:block ml-2">Ustvari kviz</span>
                        </button>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Your cards content here */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

DodajDomeno.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default DodajDomeno;
