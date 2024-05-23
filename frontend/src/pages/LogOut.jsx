import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { UserAuth } from '../context/AuthContext'; --KLARA

function Logout() {
    //const { logout } = UserAuth(); --KLARA

    const navigate = useNavigate();

    useEffect(async () => {
        // Perform logout logic here, e.g., clearing authentication tokens or user data
        console.log('User logged out');

        //await logout(); --KLARA
        
        // Redirect to the initial dashboard (login page)
        navigate('/');
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Logging out...</h1>
            </div>
        </div>
    );
}

export default Logout;
