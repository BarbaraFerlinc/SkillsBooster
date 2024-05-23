import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users } from "../Data.jsx";
//import { UserAuth } from '../context/AuthContext.js'; --KLARA

function Registration() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [postNumber, setPostNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [users, setUsers] = useState(Users);
    const [error, setError] = useState('');

    //const { createUser } = UserAuth(); --KLARA

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!agreed) {
            setError("You must agree to the terms and conditions");
            return;
        }

        const newUser = {
            id: users.length.toString(), // Assign a new id
            name,
            address,
            postNumber,
            email,
            password,
            role: 'admin', // Set default role to admin
            domains: []
        };

        setUsers([...users, newUser]);
        console.log('New user registered:', newUser);
        console.log('All users:', [...users, newUser]);

        //await createUser(email, password); --KLARA

        // Reset form fields
        setName('');
        setAddress('');
        setPostNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreed(false);
        setError('');

        // Redirect to profile page
        navigate(`/profile/${newUser.id}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Registracija podjetja</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Naziv</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Naslov</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="postNumber" className="block text-sm font-medium text-gray-700">Poštna številka</label>
                        <input
                            type="text"
                            id="postNumber"
                            value={postNumber}
                            onChange={(e) => setPostNumber(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <h1 className="text-2xl font-bold mb-6">Admin registracija</h1>
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
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="form-checkbox"
                            />
                            <span className="ml-2">I agree to the <NavLink to="/terms" className="text-blue-500 hover:underline">terms and conditions</NavLink></span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Registracija
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Registration;
