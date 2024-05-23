import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from "../../partials/Sidebar.jsx";
import Header from "../../partials/Header.jsx";
import DynamicHeader from "../../partials/dashboard/DynamicHeader.jsx";
import SeznamDomen from "./SeznamDomen.jsx";
//import { UserAuth } from '../../context/AuthContext.js'; --KLARA

function DodajDomeno({ onSubmit, currentUser }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [domainName, setDomainName] = useState("");
    const [description, setDescription] = useState("");
    const [domains, setDomains] = useState([]);
    const [showForm, setShowForm] = useState(true);

    //const { user } = UserAuth(); --KLARA

    const handleDomainNameChange = (event) => setDomainName(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleSubmit = () => {
        const newDomain = {
            id: domains.length + 1,
            name: domainName,
            description,
            autor_id: currentUser.id
        };
        setDomains([...domains, newDomain]);
        onSubmit(newDomain);
        setDomainName("");
        setDescription("");
        setShowForm(false);
    };

    const handleAddNewDomain = () => {
        setShowForm(true);
        setDomainName("");
        setDescription("");
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
                                <p>{currentUser.name}</p>
                                <button
                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-4"
                                    onClick={handleAddNewDomain}
                                >
                                    Potrdi
                                </button>
                            </div>
                        )}

                        <SeznamDomen domains={domains} />

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
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
};

export default DodajDomeno;
