import React, { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import {useThemeProvider} from "../../utils/ThemeContext.jsx";
import domene from "../../images/domains.png";
import star from "../../images/star-2-svgrepo-com.png";

function EmployeeProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [domains, setDomains] = useState([]);
    const [progressMap, setProgressMap] = useState({});

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

    useEffect(() => {
        const updateDomainScores = async () => {
            domains.forEach(async domain => {
                const novId = domain.naziv.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const score = await calculateDomainScore(domain);
                const newScore = Math.round(score * 100) / 100;
                await api.post(`/domena/spremeni-rezultat`, { id: novId, uporabnikId: user.email, novaVrednost: newScore });
            });
        };

        const fetchResults = async () => {
            if (domains.length > 0) {
                const newProgressMap = {};

                for (const domain of domains) {
                    const progress = await fetchUserResult(domain);
                    newProgressMap[domain.naziv] = progress;
                }

                setProgressMap(newProgressMap);
            }
        };

        updateDomainScores();
        fetchResults();
    }, [domains]);

    const calculateDomainScore = async (currentDomain) => {
        let result = 0;
        for (const quiz of currentDomain.kvizi) {
            const quizResult = await fetchQuizResult(quiz);
            if (quizResult !== null) {
                result += Number(quizResult);
            }
        }
        const average = result / currentDomain.kvizi.length;
        return average;
    }

    const fetchQuizResult = async (quizId) => {
        if (quizId && user) {
            try {
                const result = await api.post('/kviz/najdi-rezultat', { id: quizId, uporabnikId: user.email });
                return result.data;
            } catch (err) {
                console.error(err);
                return null;
            }
        }
        return null;
    };

    const fetchUserResult = async (domain) => {
        if (domain && user) {
            const novId = domain.naziv.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            try {
                const result = await api.post('/domena/najdi-rezultat', { id: novId, uporabnikId: user.email });
                return result.data;
            } catch (err) {
                console.error(err);
                return 0;
            }
        }
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
                const progress = progressMap[domain.naziv] || 0;
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
