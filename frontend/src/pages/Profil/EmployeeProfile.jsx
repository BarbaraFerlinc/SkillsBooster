import React, { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import {useThemeProvider} from "../../utils/ThemeContext.jsx";
import domene from "../../images/domains.png";
import star from "../../images/star-2-svgrepo-com.png";

function EmployeeProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [domains, setDomains] = useState([]);

    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider();

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
            const fetchDomains = async () => {
                try {
                    const response = await api.post('/domena/uporabnik', { id: currentUser.email });
                    setDomains(response.data);
                } catch (error) {
                    console.log("Error fetching domains", error);
                }
            };
            fetchDomains();
        }
    }, [currentUser]);

    const getUserResult = (domain, userId) => {
        const resultEntry = domain.rezultati.find(entry => entry.startsWith(`${userId};`));
        return resultEntry ? parseFloat(resultEntry.split(';')[1]) : 0;
    };

    const getProgressBarColor = (progress) => {
        if (progress >= 75) {
            return 'bg-green-500';
        } else if (progress >= 50) {
            return 'bg-yellow-400';
        } else if (progress >= 25) {
            return 'bg-orange-500';
        } else {
            return 'bg-red-500';
        }
    };
    const textClass = currentTheme === 'dark' ? 'text-white' : 'text-gray-800';

    return (
        <div className="mt-8">
            <div className="flex items-center mb-4">
                <img src={domene} alt="Icon" className="w-16 h-16 mr-4"/>
                <h2 className={`text-xl font-bold ${textClass}`}>My Domains</h2>
            </div>
            {domains.map((domain, index) => {
                const progress = currentUser ? getUserResult(domain, currentUser.email) : 0;
                const progressBarColor = getProgressBarColor(progress);

                return (
                    <div key={index} className="mb-4">
                        <div className="flex items-center mb-4">
                            <img src={star} alt="Icon" className="w-8 h-8 mr-4"/>
                            <h2 className={`text-lg font-bold ${textClass}`}>{domain.naziv}</h2>
                        </div>
                        <div className="flex items-center mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-1">
                                <div
                                    className={`h-1 rounded-full ${progressBarColor}`}
                                    style={{width: `${progress}%`}}
                                ></div>
                            </div>
                            <span className={`ml-2 text-sm font-medium text-gray-700 ${textClass}`}>{progress}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default EmployeeProfile;
