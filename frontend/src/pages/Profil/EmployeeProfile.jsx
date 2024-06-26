import React, { useEffect, useState } from 'react';
import { Users } from "../../Data.jsx";
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function EmployeeProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [domains, setDomains] = useState([]);

    const { user } = UserAuth();

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
        if (user) {
            const fetchDomene = async () => {
                try {
                    const response = await api.post('/domena/uporabnik', { id: currentUser.email });
                    setDomains(response.data);
                } catch (er) {
                    console.log("Napaka pri pridobivanju domen", er);
                }
            }
            fetchDomene();
        }
    }, [currentUser]);

    const getUserResult = (domain, userId) => {
        const resultEntry = domain.rezultati.find(entry => entry.startsWith(`${userId};`));
        return resultEntry ? resultEntry.split(';')[1] : '0';
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">My Domains</h2>
            {domains.map((domain, index) => {
                const progress = currentUser ? getUserResult(domain, currentUser.email) : '0';
                return (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold">{domain.naziv}</h3>
                        <div className="flex items-center mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">{progress}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default EmployeeProfile;
