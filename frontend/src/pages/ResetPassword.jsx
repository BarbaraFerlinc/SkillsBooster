import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext.jsx';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const { sendPasswordResetEmail } = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if (email === '') {
            setEmailError('Email is required.');
        } else if (!emailRegex.test(email)) {
            setEmailError('Please provide a valid email address.');
        }

        if (emailError) {
            return;
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(email);
            setLoading(false);
            alert('Password reset email sent! Please check your inbox.');
            navigate('/login');
        } catch (error) {
            setLoading(false);
            if (error.message === "Firebase: Error (auth/user-not-found).") {
                setEmailError("No user found with this email address.");
            } else if (error.message === "Firebase: Error (auth/invalid-email).") {
                setEmailError("Invalid email address format.");
            } else {
                setEmailError("Failed to send password reset email. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
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
                        {emailError && <p className="text-red-500">{emailError}</p>}
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Password Reset Email'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <NavLink to="/login" className="text-blue-500 hover:underline">
                        Back to Login
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
