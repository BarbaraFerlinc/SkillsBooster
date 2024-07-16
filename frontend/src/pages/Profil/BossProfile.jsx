import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function BossProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [userDomains, setUserDomains] = useState({});
    const [domainScores, setDomainScores] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = UserAuth();

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await api.get('/domena/vse');
                const names = response.data.map(domain => domain.naziv);
                setDomains(names);
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
                    setUsers(response.data);
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

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await api.get('/uporabnik/vsi');
                setAllUsers(response.data);
            } catch (err) {
                console.log("Error fetching all users", err);
            }
        };

        fetchAllUsers();
    }, []);

    const emailPostfix = currentUser ? currentUser.email.split('@')[1] : '';

    const filteredUsers = allUsers.filter(user =>
            user.email.split('@')[1] === emailPostfix && (
                user.ime_priimek.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    return (
        <div className="overflow-x-auto mt-8">
            <div className="flex">
                <div className="w-full">
                    <h2 className="text-xl font-semibold mb-4">Users table</h2>
                    <div className="min-w-full bg-white border mt-4 overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b">{user.ime_priimek}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Knowledge Matrix</h2>
                <div className="grid grid-cols-2 gap-4">
                    {domains.map((domain, index) => (
                        <div key={index} className="bg-white border p-4 rounded-md shadow-md">
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
