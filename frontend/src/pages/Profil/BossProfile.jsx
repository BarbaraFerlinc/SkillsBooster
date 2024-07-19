import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import {useThemeProvider} from "../../utils/ThemeContext.jsx";

function BossProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [userDomains, setUserDomains] = useState({});
    const [domainScores, setDomainScores] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');


    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider();

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await api.get('/domena/vse');
                const names = response.data.map(domain => domain.naziv);
                setDomains(names);
                setActiveTab(names[0] || '');
            } catch (err) {
                console.log("Error fetching domains", err);
            }
        };

        fetchDomains();
    }, []);

    useEffect(() => {
        if (user) {
            const userEmail = user.email;

            api.post('/uporabnik/profil', { id: userEmail })
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
        if (currentUser) {
            const fetchUsers = async () => {
                try {
                    const response = await api.post('/uporabnik/bossEmail', { bossEmail: user.email, adminEmail: currentUser.admin });
                    setAllUsers(response.data);
                    response.data.forEach(fetchDomainsForUser);
                } catch (err) {
                    console.log("Error fetching users", err);
                }
            };
            fetchUsers();
        }
    }, [currentUser]);

    const fetchDomainsForUser = async (user) => {
        try {
            const response = await api.post('/domena/uporabnik', { id: user.email });
            const domainNames = response.data.map(domena => domena.naziv);
            setUserDomains(prev => ({ ...prev, [user.id]: domainNames }));
            calculateDomainScores(); // Recalculate scores when domains for a user are fetched
        } catch (err) {
            console.log("Error fetching domains for user", err);
        }
    };

    const calculateDomainScores = () => {
        const newDomainScores = {};
        Object.values(userDomains).forEach(domains => {
            domains.forEach(domain => {
                if (newDomainScores[domain]) {
                    newDomainScores[domain]++;
                } else {
                    newDomainScores[domain] = 1;
                }
            });
        });
        setDomainScores(newDomainScores);
    };

    const handleTabClick = (domain) => {
        setActiveTab(domain);
    };

    const handleUserSelection = (userId) => {
        setSelectedUser(userId); // Single user selection
    };

    const handleDomainSelection = (e) => {
        setSelectedDomain(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            if (selectedUser) {
                await api.post(`/domena/uporabnik/${selectedUser}`, {
                    domain: selectedDomain
                });
            }
            setIsModalOpen(false);
            setSelectedUser('');
            setSelectedDomain('');
            // Refresh the user domains
            allUsers.forEach(fetchDomainsForUser);
        } catch (err) {
            console.log("Error adding user to domain", err);
        }
    };

    const emailPostfix = currentUser ? currentUser.email.split('@')[1] : '';

    const filteredUsers = allUsers.filter(user =>
            user.email.split('@')[1] === emailPostfix && (
                user.ime_priimek.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );
    const textClass = currentTheme === 'dark' ? 'text-white' : 'text-gray-800';


    return (
        <div className={`overflow-x-auto mt-4 ${textClass}`}>
            <div className="mt-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                    Add User to Domain
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className={`bg-white ${textClass} p-8 rounded-md shadow-md w-1/2`}>
                        <h2 className="text-xl font-semibold mb-4">Add User to Domain</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Select Domain:</label>
                            <select
                                value={selectedDomain}
                                onChange={handleDomainSelection}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select a domain</option>
                                {domains.map((domain, index) => (
                                    <option key={index} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Select User:</label>
                            {filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name="selectedUser"
                                        checked={selectedUser === user.id}
                                        onChange={() => handleUserSelection(user.id)}
                                        className="mr-2"
                                    />
                                    <span>{user.ime_priimek} ({user.email})</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="btn bg-green-500 hover:bg-green-600 text-white mr-2"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn bg-red-500 hover:bg-red-600 text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex">
                <div className="w-full mt-4">
                    <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Domains</h2>
                    <div className="flex mb-4">
                        {domains.map((domain, index) => (
                            <button
                                key={index}
                                onClick={() => handleTabClick(domain)}
                                className={`mr-2 p-2 border rounded ${activeTab === domain ? 'bg-blue-400 text-white' : '${textClass} '}`}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                    {domains.map((domain, index) => (
                        activeTab === domain && (
                            <div key={index} className={`min-w-full ${textClass}  border mt-4 overflow-x-auto`}>
                                <table className="min-w-full">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Email</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredUsers.filter(user => userDomains[user.id]?.includes(domain)).map(user => (
                                        <tr key={user.id}>
                                            <td className="py-2 px-4 border-b">{user.ime_priimek}</td>
                                            <td className="py-2 px-4 border-b">{user.email}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ))}
                </div>
            </div>
            <div className="mt-8">
                <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Knowledge Matrix</h2>
                <div className="grid grid-cols-2 gap-4">
                    {domains.map((domain, index) => (
                        <div key={index} className={`p-4 rounded-md shadow-md ${textClass}  border`}>
                            <h3 className="text-lg font-semibold mb-2">{domain}</h3>
                            <p>Average Score: {domainScores[domain] || 0}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BossProfile;
