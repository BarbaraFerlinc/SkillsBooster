// SessionManager.js
import React, { useContext, useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { auth } from './firebase';
import Modal from 'react-modal';

const SessionManager = ({ children }) => {
    const { user } = UserAuth();
    const [showModal, setShowModal] = useState(false);
    let logoutTimer;
    let countdownTimer;

    useEffect(() => {
        if (user) {
        resetLogoutTimer();

        window.addEventListener('mousemove', resetLogoutTimer);
        window.addEventListener('keydown', resetLogoutTimer);
        }

        return () => {
        clearTimeout(logoutTimer);
        clearTimeout(countdownTimer);
        window.removeEventListener('mousemove', resetLogoutTimer);
        window.removeEventListener('keydown', resetLogoutTimer);
        };
    }, [user]);

    const startLogoutTimer = () => {
        logoutTimer = setTimeout(() => {
        setShowModal(true);
        startCountdown();
        }, 15 * 60 * 1000); // 15 minut
    };

    const resetLogoutTimer = () => {
        clearTimeout(logoutTimer);
        startLogoutTimer();
    };

    const startCountdown = () => {
        let counter = 60;
        countdownTimer = setInterval(() => {
        if (counter <= 0) {
            clearInterval(countdownTimer);
            handleLogout();
        }
        counter--;
        }, 1000);
    };

    const handleStayLoggedIn = () => {
        setShowModal(false);
        clearInterval(countdownTimer);
        resetLogoutTimer();
    };

    const handleLogout = () => {
        auth.signOut();
        setShowModal(false);
    };

    return (
        <>
        {children}
        <Modal isOpen={showModal}>
            <h2>Vaša seja poteče čez 1 minuto</h2>
            <button onClick={handleStayLoggedIn}>Ostani prijavljen</button>
            <button onClick={handleLogout}>Odjava</button>
        </Modal>
        </>
    );
};

export default SessionManager;
