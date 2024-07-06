import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function BossProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [userDomains, setUserDomains] = useState({});
    const [showUserList, setShowUserList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = UserAuth();

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await api.get('/domena/vse');
                const names = response.data.map(domain => domain.naziv);
                setDomains(names);
            } catch (er) {
                console.log("Napaka pri pridobivanju domen", er);
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
                    setUsers(response.data);
                    response.data.forEach(fetchDomainsForUser);
                } catch (er) {
                    console.log("Napaka pri pridobivanju uporabnikov", er);
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
        } catch (er) {
            console.log("Napaka pri pridobivanju domen", er);
        }
    };

    const handleAddUser = async (user) => {
        if (!users.find(u => u.id === user.id)) {
            setUsers(prev => [...prev, user]);
            fetchDomainsForUser(user);
        }
        setShowUserList(false);
    };

    const handleDomainChange = (userId, domain) => {
        setUserDomains(prev => {
            const userDomainsCopy = { ...prev };
            if (userDomainsCopy[userId]) {
                if (userDomainsCopy[userId].includes(domain)) {
                    userDomainsCopy[userId] = userDomainsCopy[userId].filter(d => d !== domain);
                } else {
                    userDomainsCopy[userId].push(domain);
                }
            } else {
                userDomainsCopy[userId] = [domain];
            }
            return userDomainsCopy;
        });
    };

    const handleSubmitChanges = () => {
        // handle submit changes logic here
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await api.get('/uporabnik/vsi');
                setAllUsers(response.data);
            } catch (er) {
                console.log("Napaka pri pridobivanju vseh uporabnikov", er);
            }
        };

        fetchAllUsers();
    }, []);

    const filteredUsers = allUsers.filter(user =>
        user.ime_priimek.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overflow-x-auto mt-8">
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => setShowUserList(!showUserList)}
            >
                Add User
            </button>
            {showUserList && (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded p-2 mb-2"
                    />
                    <ul className="border rounded max-h-40 overflow-y-auto">
                        {filteredUsers.map(user => (
                            <li
                                key={user.id}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleAddUser(user)}
                            >
                                {user.ime_priimek} ({user.email})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <table className="min-w-full bg-white border mt-4">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Domains</th>
                </tr>
                </thead>

                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.ime_priimek}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">
                            {domains.map(domain => (
                                <label key={domain} className="block">
                                    <input
                                        type="checkbox"
                                        checked={userDomains[user.id]?.includes(domain) || false}
                                        onChange={() => handleDomainChange(user.id, domain)}
                                    />
                                    {domain}
                                </label>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {Object.keys(userDomains).length > 0 && (
                <div className="mt-4 text-right">
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        onClick={handleSubmitChanges}
                    >
                        Submit Changes
                    </button>
                </div>
            )}
        </div>
    );
}

export default BossProfile;
