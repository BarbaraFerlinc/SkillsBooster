import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function BossProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [userDomains, setUserDomains] = useState({});

    const { user } = UserAuth();

    useEffect(() => {
        const fetchDomene = async () => {
            try {
                const response = await api.get('/domena/vse');
                const nazivi = response.data.map(domain => domain.naziv);
                setDomains(nazivi);
            } catch (er) {
                console.log("Napaka pri pridobivanju domen", er);
            }
        }
    
        fetchDomene();
    }, [])

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
        if (currentUser) {
            const fetchUporabniki = async () => {
                try {
                    const response = await api.post('/uporabnik/bossEmail', { bossEmail: user.email, adminEmail: currentUser.admin });
                    setUsers(response.data);
                    response.data.forEach(fetchDomeneForUser);
                } catch (er) {
                    console.log("Napaka pri pridobivanju uporabnikov", er);
                }
            }
            fetchUporabniki();
        }
    }, [currentUser]);

    const fetchDomeneForUser = async (uporabnik) => {
        try {
            const response = await api.post('/domena/uporabnik', { id: uporabnik.email });
            const domainNames = response.data.map(domena => domena.naziv);
            setUserDomains(prev => ({ ...prev, [uporabnik.id]: domainNames }));
        } catch (er) {
            console.log("Napaka pri pridobivanju domen", er);
        }
    }

    const handleChange = (email, domena) => {
        // dodajanje uporabnika v domeno
    } 

    return (
        <div className="overflow-x-auto mt-8">
            <table className="min-w-full bg-white border">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Domains</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.ime_priimek}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{userDomains[user.id] ? userDomains[user.id].join(', ') : 'Loading...'}</td>
                        <td className="py-2 px-4 border-b">
                            <select
                                value={domains[0]}
                                onChange={(e) => handleChange(user.email, e.target.value)}
                                className="bg-gray-200 border rounded p-1"
                            >
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>
                                        {domain}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default BossProfile;
