import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function Logout() {
    const { logout } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                navigate('/');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

        performLogout();
    }, [logout, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Logging out...</h1>
            </div>
        </div>
    );
}

export default Logout;
