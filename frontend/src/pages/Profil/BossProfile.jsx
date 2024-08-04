import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import { useThemeProvider } from "../../utils/ThemeContext.jsx";
import domene from "../../images/domains.png";
import stat from "../../images/statistics-svgrepo-com.png";

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

function BossProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(initialDomain);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userResults, setUserResults] = useState({});

    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider();

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await api.post('/domena/lastnik', { id: user.email });
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

    useEffect(() => {
        const fetchResults = async () => {
            if (domains.length > 0) {
                const results = {};
                for (const user of allUsers) {
                    results[user.email] = {};
                    for (const domain of domains) {
                        const result = await fetchUserResult(user.email, domain);
                        results[user.email][domain] = result;
                    }
                }
                setUserResults(results);
            }
        };

        fetchResults();
    }, [domains, allUsers]);

    const fetchDomainsForUser = async (user) => {
        try {
            const response = await api.post('/domena/uporabnik', { id: user.email });
            const domainNames = response.data.map(domena => domena.naziv);

            if (selectedDomain.naziv && domainNames.includes(selectedDomain.naziv)) {
                setFilteredUsers(prevFilteredUsers => 
                    [...prevFilteredUsers, user]
                );
            }
            fetchResultsForUser(user.email, domainNames);
        } catch (err) {
            console.log("Error fetching domains for user", err);
        }
    };

    const fetchUsersForDomain = async (domain) => {
        const novId = domain.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        try {
            const response = await api.post('/domena/uporabniki', { id: novId });
            const domainUsers = response.data;
            setFilteredUsers(domainUsers);
        } catch (err) {
            console.log("Error fetching domains for user", err);
        }
    };

    const fetchResultsForUser = async (userEmail, domains) => {
        for (const domain of domains) {
            const result = await fetchUserResult(userEmail, domain);
            setUserResults(prev => ({ 
                ...prev, 
                [userEmail]: {
                    ...(prev[userEmail] || {}),
                    [domain]: result 
                }
            }));
        }
    };

    const fetchUserResult = async (email, domain) => {
        if (domain && email && domain != undefined) {
            const novId = domain.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            try {
                const result = await api.post('/domena/najdi-rezultat', { id: novId, uporabnikId: email });
                return result.data || '/';
            } catch (err) {
                console.error(err);
                return '/';
            }
        }
    };

    const handleTabClick = (domainValue) => {
        setActiveTab(domainValue);
        const novId = domainValue.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domena/id', { id: novId })
            .then(res => {
                const domain = res.data;
                setSelectedDomain(domain);
                if (domain) {
                    fetchUsersForDomain(domain.naziv);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleDomainSelection = async (e) => {
        const domainValue = e.target.value;
        const novId = domainValue.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        api.post('/domena/id', { id: novId })
            .then(res => {
                const domain = res.data;
                setSelectedDomain(domain);
                if (domain) {
                    fetchUsersForDomain(domain.naziv);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleSubmit = async () => {
        try {
            const novId = selectedDomain.naziv.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            for (const userId of selectedUsers) {
                await api.put(`/domena/uporabnik/${novId}`, { uporabnikId: userId });
                for (const quiz of selectedDomain.kvizi) {
                    await api.post(`/kviz/dodaj-rezultat`, { id: quiz, uporabnikId: userId, vrednost: '0' });
                }
            }
            console.log(selectedUsers);
            setIsModalOpen(false);
            setSelectedUsers([]);
            setSelectedDomain(initialDomain);
            allUsers.forEach(fetchDomainsForUser);
        } catch (err) {
            console.log("Error adding user to domain", err);
        }
    };

    const textClass = currentTheme === 'dark' ? 'text-white' : 'text-gray-800';
    const bgClass = currentTheme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const buttonClass = domains.length === 0 
        ? 'btn bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'btn bg-indigo-500 hover:bg-indigo-600 text-white';

    return (
        <div className={`overflow-x-auto mt-4 ${textClass}`}>
            <div className="mt-4">
                <button
                    onClick={() => domains.length > 0 && setIsModalOpen(true)}
                    className={buttonClass}
                    disabled={domains.length === 0}
                >
                    Add User to Domain
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className={`p-8 rounded-md shadow-md w-1/2 ${bgClass}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Add User to Domain</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Select Domain:</label>
                            <select
                                value={selectedDomain.naziv}
                                onChange={handleDomainSelection}
                                className="w-full p-2 border rounded-md "
                            >
                                <option value="">Select a domain</option>
                                {domains.map((domain, index) => (
                                    <option key={index} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Select User:</label>
                            {allUsers.filter(user => !filteredUsers.includes(user.email)).map(user => (
                                <div key={user.email} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.email)}
                                        onChange={() => handleUserSelection(user.email)}
                                        className="mr-2"
                                    />
                                    <span>{user.ime_priimek} ({user.email})</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="btn bg-red-500 text-white py-2 px-5 rounded mr-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="btn bg-green-500 text-white py-2 px-5 rounded mr-1"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex">
                <div className="w-full mt-4">
                    <div className="flex items-center mb-4">
                        <img src={domene} alt="Icon" className="w-16 h-16 mr-4"/>
                        <h2 className={`text-xl font-bold ${textClass}`}>Domains</h2>
                    </div>
                    {domains.length === 0 ? (
                        <p>No domains</p>
                    ) : (
                        <>
                            <div className="flex mb-4">
                                {domains.map((domain, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTabClick(domain)}
                                        className={`mr-2 p-2 border rounded ${activeTab === domain ? 'bg-blue-400 text-white' : textClass}`}
                                    >
                                        {domain}
                                    </button>
                                    ))}
                            </div>
                            {domains.map((domain, index) => (
                                activeTab === domain && (
                                    <div key={index} className={`min-w-full ${textClass} border mt-4 overflow-x-auto`}>
                                        <table className="min-w-full">
                                            <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b">Name</th>
                                                <th className="py-2 px-4 border-b">Email</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredUsers.length > 0 ? (
                                                allUsers.filter(user => filteredUsers.includes(user.email)).map(user => (
                                                    <tr key={user.email}>
                                                        <td className="py-2 px-4 border-b">{user.ime_priimek}</td>
                                                        <td className="py-2 px-4 border-b">{user.email}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="py-2 px-4 text-center">This domain has no users yet</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <div className="flex items-center mb-4">
                    <img src={stat} alt="Icon" className="w-16 h-16 mr-4"/>
                    <h2 className={`text-xl font-bold ${textClass}`}>Kowledge Matrix</h2>
                </div>
                {domains.length === 0 ? (
                    <p>Add domains to see results</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2">User</th>
                                {domains.map((domain, index) => (
                                    <th key={index} className="border px-4 py-2">{domain}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {allUsers.map((user, userIndex) => (
                                <tr key={userIndex}>
                                    <td className="border px-4 py-2">{user.ime_priimek}</td>
                                    {domains.map((domain, domainIndex) => (
                                        <td key={domainIndex} className="border px-4 py-2 text-center">
                                        {userResults[user.email] && userResults[user.email][domain] !== undefined ? userResults[user.email][domain] : '/'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BossProfile;
