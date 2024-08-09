import React, { useEffect, useState, useRef } from 'react';
import { UserAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const SessionManager = ({ children }) => {
    const { user } = UserAuth();
    const [showModal, setShowModal] = useState(false);
    const [counter, setCounter] = useState(60);
    
    const logoutTimerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    useEffect(() => {
        if (user) {
            resetLogoutTimer();

            window.addEventListener('mousemove', resetLogoutTimer);
            window.addEventListener('keydown', resetLogoutTimer);
        }

        return () => {
            clearTimeout(logoutTimerRef.current);
            clearTimeout(countdownTimerRef.current);
            window.removeEventListener('mousemove', resetLogoutTimer);
            window.removeEventListener('keydown', resetLogoutTimer);
        };
    }, [user]);

    const startLogoutTimer = () => {
        logoutTimerRef.current = setTimeout(() => {
            setShowModal(true);
            startCountdown();
        }, 59 * 60 * 1000); // 59 minutes
    };

    const resetLogoutTimer = () => {
        clearTimeout(logoutTimerRef.current);
        clearInterval(countdownTimerRef.current);
        startLogoutTimer();
    };

    const startCountdown = () => {
        let counterValue = 60;
        setCounter(counterValue);
        countdownTimerRef.current = setInterval(() => {
            counterValue -= 1;
            setCounter(counterValue);
            if (counterValue <= 0) {
                clearInterval(countdownTimerRef.current);
                handleLogout();
            }
        }, 1000);
    };

    const handleStayLoggedIn = () => {
        setShowModal(false);
        clearInterval(countdownTimerRef.current);
        resetLogoutTimer();
    };

    const handleLogout = () => {
        auth.signOut();
        setShowModal(false);
    };

    return (
        <>
        {children}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-200 p-6 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Your session expires in {counter} seconds</h2>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleStayLoggedIn}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Stay logged in
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SessionManager;
