import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Users} from "../Data.jsx";
import { UserAuth } from '../context/AuthContext.jsx';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [error, setError] = useState('');
    
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { signIn } = UserAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        
        if (email === '') {
            setEmailError('Email is required.');
        } else if (!emailRegex.test(email)) {
            setEmailError('Please provide a valid email address.');
        }
      
        if (password === '') {
            setPasswordError('Password is required.');
        }
    
        if (emailError || passwordError) {
            return;
        }

        try {
            await signIn(email, password);
            // pokaže se okno in piše 'Uspešno ste se prijavili.'
      
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (er) {
            if (er.message === "Firebase: Error (auth/user-not-found).") {
                setPasswordError("User with this email does not exist.");
            } else if (er.message === "Firebase: Error (auth/wrong-password).") {
                setPasswordError("Email or password is incorrect.");
            } else if (er.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
                setPasswordError("Too many failed login attempts. Please try again later.");
            }      
        };
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        {emailError && <p className="text-red-500">{emailError}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        {passwordError && <p className="text-red-500">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
