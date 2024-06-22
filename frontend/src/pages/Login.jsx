import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Users } from "../Data.jsx";
//import { UserAuth } from '../context/AuthContext.js'; --KLARA

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //const { signIn } = UserAuth(); --KLARA

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = Users.find(u => u.email === email && u.password === password);

        if (user) {
            //await signIn(email, password); --KLARA

            navigate(`/profile/${user.id}`, { state: { user } });
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <form onSubmit={handleLogin}>
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
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <NavLink to="/register" className="text-blue-500 hover:underline">
                        Register your company here
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Login;
