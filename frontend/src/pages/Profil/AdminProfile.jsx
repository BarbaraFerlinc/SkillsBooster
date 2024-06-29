import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function AdminProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');

    const { user } = UserAuth();

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
                } catch (er) {
                    console.log("Napaka pri pridobivanju uporabnikov", er);
                }
            }
            fetchUporabniki();
        }
    }, [currentUser]);

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleConfirmAddUser = async () => {
        const newUser = {
            id: Date.now(),
            email: newUserEmail,
            password: Math.random().toString(36).slice(-8), // Generate a random password
            vloga: newUserRole
        };
        try {
            await api.post('/uporabniki/', newUser);
            setUsers([...users, newUser]);
            setShowModal(false);
            setNewUserEmail('');
            setNewUserRole('user');
        } catch (error) {
            console.error("Error adding new user:", error);
        }
    };

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
                    <div className="bg-white p-6 rounded shadow-md">
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
                                className="bg-gray-200 border rounded p-2 w-full"
                            >
                                <option value="user">User</option>
                                <option value="boss">Boss</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleConfirmAddUser}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="min-w-full bg-white border">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.ime_priimek}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.vloga}</td>
                        <td className="py-2 px-4 border-b">
                            <select
                                value={user.vloga}
                                className="bg-gray-200 border rounded p-1"
                            >
                                <option value="employee">Employee</option>
                                <option value="boss">Boss</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProfile;
