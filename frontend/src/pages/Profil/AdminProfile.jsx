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
    const [newUserRole, setNewUserRole] = useState('user');

    const { user } = UserAuth();
    const { currentTheme } = useThemeProvider();

    useEffect(() => {
        if (user) {
            const uporabnikovEmail = user.email;
            api.post('/uporabnik/profil', { id: uporabnikovEmail })
                .then(res => {
                    const profil = res.data;
                    setCurrentUser(profil);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [user]);

    useEffect(() => {
        if (currentUser) {
            const fetchUporabniki = async () => {
                try {
                    const response = await api.post('/uporabnik/adminEmail', { adminEmail: currentUser.email });
                    setUsers(response.data);
                    setUserAdded(false);
                } catch (er) {
                    console.log("Napaka pri pridobivanju uporabnikov", er);
                }
            }
            fetchUporabniki();
        }
    }, [currentUser, userAdded]);

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleConfirmAddUser = async () => {
        var config = {apiKey: import.meta.env.VITE_API_KEY,
                authDomain: import.meta.env.VITE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_APP_ID};
        var secondaryApp = initializeApp(config, "Secondary");
        let auth = getAuth(secondaryApp);
        
        const newUser = {
            ime_priimek: newUserName,
            email: newUserEmail,
            geslo: Math.random().toString(36).slice(-12),
            vloga: newUserRole,
            admin: currentUser.email
        };

        try {
            await createUserWithEmailAndPassword(auth, newUserEmail, newUser.geslo);

            await signOut(auth);

            const response = await api.post("/uporabnik/dodaj", newUser, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            setUserAdded(true);
            setShowModal(false);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserRole('user');
        } catch (error) {
            console.error("Error adding new user:", error);
        } finally {
            if (secondaryApp) {
                secondaryApp.delete();
            }
        }
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
                                <option value="user">User</option>
                                <option value="boss">Manager</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAddUser}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

                        <td className={`py-2 px-15 border-b  ${textClass}`}>{user.ime_priimek}</td>
                        <td className={`py-2 px-15  border-b ${textClass}`}>{user.email}</td>
                        <td className={`py-2 px-15  border-b ${textClass}`}>{user.vloga}</td>
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
