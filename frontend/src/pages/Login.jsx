import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Login({ onLogin }) {
    // State to store user input
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass credentials to the parent component for authentication
        onLogin(credentials);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={credentials.username} onChange={handleChange}/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange}/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

Login.propTypes = {
    /**
     * Callback function to handle login.
     * It receives the user's credentials as an argument.
     */
    onLogin: PropTypes.func.isRequired,
};

export default Login;
