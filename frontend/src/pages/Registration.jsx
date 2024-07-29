import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext.jsx';
import api from "../services/api.js";

const initialCompany = {
    naslov: "",
    naziv: "",
    postna_stevilka: 0,
    admin_email: ""
}

const initialUser = {
    ime_priimek: "Administrator",
    email: "",
    geslo: "",
    vloga: "admin",
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [users, setUsers] = useState([]);

    const { createUser } = UserAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPodjetja = async () => {
            try {
                const response = await api.get('/podjetje/vsa');
                setCompanies(response.data);
            } catch (er) {
                console.log("Napaka pri pridobivanju podjetij", er);
            }
        }
        
        const fetchUporabniki = async () => {
            try {
                const response = await api.get('/uporabnik/vsi');
                setUsers(response.data);
            } catch (er) {
                console.log("Napaka pri pridobivanju uporabnikov", er);
            }
        }
    
        fetchPodjetja();
        fetchUporabniki();
    }, [])

    const validateForm = () => {
        let formErrors = {};
        let formIsValid = true;
    
        if (!company.naziv) {
            formIsValid = false;
            formErrors["naziv"] = "Please add your company name";
        }

        if (!company.naslov) {
            formIsValid = false;
            formErrors["naslov"] = "Please add your address";
        }
        
        if (!company.postna_stevilka) {
            formIsValid = false;
            formErrors["postna_stevilka"] = "Please add your post code";
        }
    
        if (!email) {
            formIsValid = false;
            formErrors["email"] = "Please add your email";
        }
    
        for (let i = 0; i < users.length; i++) {
          if (users[i].email == email) {
            formIsValid = false;
            formErrors["email"] = "This email is already in use.";
          }
        }
    
        if (!password) {
            formIsValid = false;
            formErrors["geslo"] = "Please add your password";
        }
    
        if (password && password.length < 6) {
            formIsValid = false;
            formErrors["geslo"] = "The password should have at least 6 characters";
        }

        if (password !== confirmPassword) {
            formIsValid = false;
            formErrors["geslo_enako"] = "Please, add your password";
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
                user.geslo = password;
                company.admin_email = email;

                console.log('Sending user data:', user);
                const response1 = await api.post("/uporabnik/dodaj", user, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                console.log('User response:', response1.data);

                console.log('Sending company data:', company);
                const response2 = await api.post("/podjetje/dodaj", company, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                console.log('Company response:', response2.data);

                if (response1.status === 200 && response2.status === 200) {
                    // pokaže se okno in piše 'Uspešno ste registrirali podjetje.'
                    console.log('Both requests successful');
                }
                
                setCompany(initialCompany);
                setUser(initialUser);

                await createUser(email, password);

                setTimeout(() => {
                    navigate('/profile');
                }, 3000);
            } catch (er) {
                setError(er.message);
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
                        <label htmlFor="naziv" className="block text-sm font-medium text-gray-700">Company name</label>
                        <input
                            type="text"
                            id="naziv"
                            name='naziv'
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.naziv}</small>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="naslov" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="naslov"
                            name='naslov'
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.naslov}</small>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="postna_stevilka" className="block text-sm font-medium text-gray-700"> Post code</label>
                        <input
                            type="text"
                            id="postna_stevilka"
                            name='postna_stevilka'
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <small className="text-red-500">{errors.postna_stevilka}</small>
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
                        <small className="text-red-500">{errors.geslo_enako}</small>
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
