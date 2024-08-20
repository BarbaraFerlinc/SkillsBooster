import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {useThemeProvider} from "../../utils/ThemeContext.jsx";

function AdminProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [userAdded, setUserAdded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('employee');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider();

    useEffect(() => {
        if (user) {
            const userEmail = user.email;
            api.post('/user/id', { id: userEmail })
                .then(res => {
                    const profile = res.data;
                    setCurrentUser(profile);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [user]);

    useEffect(() => {
        if (currentUser) {
            const fetchUsers = async () => {
                try {
                    const response = await api.post('/user/adminEmail', { adminEmail: currentUser.email });
                    setUsers(response.data);
                    setUserAdded(false);
                } catch (er) {
                    console.log("Error retrieving users", er);
                }
            }
            fetchUsers();
        }
    }, [currentUser, userAdded]);

    const handleAddUser = () => {
        setShowModal(true);
    };

    const validateForm = () => {
        let formErrors = {};
        let formIsValid = true;
    
        if (!newUserName) {
            formIsValid = false;
            formErrors["name"] = "Please add user's name";
        }
    
        if (!newUserEmail) {
            formIsValid = false;
            formErrors["email"] = "Please add user's email";
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(newUserEmail)) {
                formIsValid = false;
                formErrors["email"] = "Please enter a valid email address";
            }
        }
        
        if (!newUserRole) {
            formIsValid = false;
            formErrors["role"] = "Please add user's role";
        }
    
        setErrors(formErrors);
        return formIsValid;
    }

    const handleConfirmAddUser = async () => {
        if (validateForm()){
            setLoading(true);

            const config = {apiKey: import.meta.env.VITE_API_KEY,
                    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
                    projectId: import.meta.env.VITE_PROJECT_ID,
                    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
                    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
                    appId: import.meta.env.VITE_APP_ID};
            const secondaryApp = initializeApp(config, "Secondary");
            let auth = getAuth(secondaryApp);
            
            const newUser = {
                full_name: newUserName,
                email: newUserEmail,
                password: Math.random().toString(36).slice(-12),
                role: newUserRole,
                admin: currentUser.email
            };

            try {
                await createUserWithEmailAndPassword(auth, newUserEmail, newUser.password);
                await signOut(auth);

                await api.post("/user/add", newUser, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                setUserAdded(true);
                setShowModal(false);
                setNewUserName('');
                setNewUserEmail('');
                setNewUserRole('employee');
                setLoading(false);
            } catch (error) {
                console.error("Error adding new user:", error);
                setLoading(false);
            } finally {
                if (secondaryApp) {
                    secondaryApp.delete();
                }
            }
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('employee');
        setErrors({});
    };

    const textClass = currentTheme === 'dark' ? 'text-black' : 'text-gray-800';
    return (
        <div className="overflow-x-auto mt-8">
            <button
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleAddUser}
            >
                Add User
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-200 p-6 rounded shadow-md">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name and Surname
                            </label>
                            <input
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            <small className="text-red-500">{errors.name}</small>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            <small className="text-red-500">{errors.email}</small>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Role
                            </label>
                            <select
                                value={newUserRole}
                                onChange={(e) => setNewUserRole(e.target.value)}
                                className="bg-white  rounded p-2 w-full"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                            </select>
                            <small className="text-red-500">{errors.role}</small>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleCancel}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAddUser}
                                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white border">
                <thead>
                <tr>

                    <th className={`py-2 px-5 border-b ${textClass}`}>Name</th>
                    <th className={`py-2 px-5 border-b ${textClass}`}>Email</th>
                    <th className={`py-2 px-5 border-b ${textClass}`}>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>

                        <td className={`py-2 px-15 border-b  ${textClass}`}>{user.full_name}</td>
                        <td className={`py-2 px-15  border-b ${textClass}`}>{user.email}</td>
                        <td className={`py-2 px-15  border-b ${textClass}`}>{user.role}</td>
                        <td className={`py-2 px-15  border-b ${textClass}`}>

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProfile;
