import React, { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import {useThemeProvider} from "../../utils/ThemeContext.jsx";
import domainsImg from "../../images/domains.png";
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

            api.post('/user/id', { id: userEmail })
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
                    const response = await api.post('/domain/user', { id: currentUser.email });
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
                const newId = domain.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const score = await calculateDomainScore(domain);
                const newScore = Math.round(score * 100) / 100;
                await api.post(`/domain/change-result`, { id: newId, userId: user.email, newValue: newScore });
            });
        };

        const fetchResults = async () => {
            if (domains.length > 0) {
                const newProgressMap = {};

                for (const domain of domains) {
                    const progress = await fetchUserResult(domain);
                    newProgressMap[domain.name] = progress;
                }

                setProgressMap(newProgressMap);
            }
        };

        updateDomainScores();
        fetchResults();
    }, [domains]);

    const calculateDomainScore = async (currentDomain) => {
        let result = 0;
        for (const quiz of currentDomain.quizzes) {
            const quizResult = await fetchQuizResult(quiz);
            if (quizResult !== null) {
                result += Number(quizResult);
            }
        }
        const average = result / currentDomain.quizzes.length;
        return average;
    }

    const fetchQuizResult = async (quizId) => {
        if (quizId && user) {
            try {
                const result = await api.post('/quiz/find-result', { id: quizId, userId: user.email });
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
            const newId = domain.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            try {
                const result = await api.post('/domain/find-result', { id: newId, userId: user.email });
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
                <img src={domainsImg} alt="Icon" className="w-16 h-16 mr-4"/>
                <h2 className={`text-xl font-bold ${textClass}`}>My Domains</h2>
            </div>
            {domains.length === 0 ? (
                <p>You haven't been added to a domain yet.</p>
            ) : (
                domains.map((domain, index) => {
                    const progress = progressMap[domain.name] || 0;
                    const progressBarColor = getProgressBarColor(progress);

                    return (
                        <div key={index} className="mb-4">
                            <div className="flex items-center mb-4">
                                <img src={star} alt="Icon" className="w-8 h-8 mr-4"/>
                                <h2 className={`text-lg font-bold ${textClass}`}>{domain.name}</h2>
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
                })
            )}
        </div>
    );
}

export default EmployeeProfile;
