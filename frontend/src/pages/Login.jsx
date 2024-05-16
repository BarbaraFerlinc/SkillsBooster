import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreed) {
            alert("You must agree to the terms and conditions.");
            return;
        }
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);

        // Assuming login is successful, redirect to dashboard
        history.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!agreed}
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <NavLink to="/register" className="text-blue-500 hover:underline">
                        Registriraj podjetje
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;
