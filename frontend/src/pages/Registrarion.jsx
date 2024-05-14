import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {useHistory} from "react-router-dom";


function Registration({ onRegister }) {
    const history = useHistory();

    // State to store user input
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        postalCode: ''
    });

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the onRegister function passed as prop
        const success = await onRegister(formData);
        if (success) {
            // If registration is successful, redirect to the dashboard
            history.push('/dashboard');
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}/>
                </div>
                <div>
                    <label>Postal Code:</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange}/>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

Registration.propTypes = {
    /**
     * Callback function to handle registration.
     * It receives the user's registration data as an argument.
     * Should return true if registration is successful, false otherwise.
     */
    onRegister: PropTypes.func.isRequired,
};

export default Registration;
