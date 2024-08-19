import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext.jsx';
import api from "../services/api.js";

const initialCompany = {
    address: "",
    name: "",
    postal_code: 0,
    admin_email: ""
}

const initialUser = {
    full_name: "Administrator",
    email: "",
    password: "",
    role: "admin",
    admin: ""
}

function Registration() {    
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [company, setCompany] = useState(initialCompany);
    const [user, setUser] = useState(initialUser);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);

    const { createUser } = UserAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/company/all');
                setCompanies(response.data);
            } catch (er) {
                console.log("Error getting companies", er);
            }
        }
        
        const fetchUsers = async () => {
            try {
                const response = await api.get('/user/all');
                setUsers(response.data);
            } catch (er) {
                console.log("Error retrieving users", er);
            }
        }
    
        fetchCompanies();
        fetchUsers();
    }, [])

    const validateForm = () => {
        let formErrors = {};
        let formIsValid = true;
    
        if (!company.name) {
            formIsValid = false;
            formErrors["name"] = "Please add your company name";
        }

        if (!company.address) {
            formIsValid = false;
            formErrors["address"] = "Please add your address";
        }
        
        if (!company.postal_code) {
            formIsValid = false;
            formErrors["postal_code"] = "Please add your post code";
        }
    
        if (!email) {
            formIsValid = false;
            formErrors["email"] = "Please add your email";
        }
    
        for (let user of users){
            if (user.email == email) {
                formIsValid = false;
                formErrors["email"] = "This email is already in use.";
            }
        }
    
        if (!password) {
            formIsValid = false;
            formErrors["password"] = "Please add your password";
        }
    
        if (password && password.length < 6) {
            formIsValid = false;
            formErrors["password"] = "The password should have at least 6 characters";
        }

        if (password !== confirmPassword) {
            formIsValid = false;
            formErrors["same_password"] = "Please, add your password";
        }

        if (!agreed) {
            formIsValid = false;
            formErrors["agreed"] = "Please confirm, to agree with terms and conditions";
        }

        setErrors(formErrors);
        return formIsValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            setIsSubmitting(true);

            try {
                user.email = email;
                user.admin = email;
                user.password = password;
                company.admin_email = email;

                const response1 = await api.post("/user/add", user, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                const response2 = await api.post("/company/add", company, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                if (response1.status === 200 && response2.status === 200) {
                    console.log('Both requests successful');
                }
                
                setCompany(initialCompany);
                setUser(initialUser);

                await createUser(email, password);

                setTimeout(() => {
                    navigate('/profile');
                }, 3000);
            } catch (er) {
                console.error(er.message);
            }
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
    
        setCompany((prevState) => {
          const nextState = {
            ...prevState,
            [name]: value,
          };
          return nextState;
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Company registration</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company name</label>
                        <input
                            type="text"
                            id="name"
                            name='name'
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.name}</small>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            name='address'
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.address}</small>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal code</label>
                        <input
                            type="text"
                            id="postal_code"
                            name='postal_code'
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.postal_code}</small>
                    </div>

                    <h1 className="text-2xl font-bold mb-6">Admin registration</h1>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.email}</small>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name='password'
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.geslo}</small>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm
                            Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.same_password}</small>
                    </div>

                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.value)}
                                disabled={isSubmitting}
                                className="form-checkbox"
                            />
                            <span className="ml-2">I agree to the <NavLink to="/terms"
                                className="text-blue-500 hover:underline">terms and conditions</NavLink></span>
                        </label>
                        <br/>
                        <small className="text-red-500">{errors.agreed}</small>
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Registration;
