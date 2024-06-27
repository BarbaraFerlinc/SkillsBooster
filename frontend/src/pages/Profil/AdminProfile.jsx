import React, { useState } from 'react';
import { Users } from "../../Data.jsx";

function AdminProfile() {
    const [users, setUsers] = useState(Users);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', role: 'user' });

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    const handleAddUser = () => {
        setShowModal(true);
    };

    const handleConfirmAddUser = () => {
        const id = users.length + 1;
        const password = Math.random().toString(36).slice(-8); // Generate a random password
        setUsers([...users, { id, ...newUser, password }]);
        setShowModal(false);
        setNewUser({ email: '', role: 'user' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({ ...prevState, [name]: value }));
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Add New User</h2>
                        <label className="block mb-2">
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                className="block w-full mt-1 p-2 border rounded"
                            />
                        </label>
                        <label className="block mb-4">
                            Role:
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                                className="block w-full mt-1 p-2 border rounded"
                            >
                                <option value="user">User</option>
                                <option value="boss">Boss</option>
                            </select>
                        </label>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                            onClick={handleConfirmAddUser}
                        >
                            Confirm
                        </button>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
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
                        <td className="py-2 px-4 border-b">{user.name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                        <td className="py-2 px-4 border-b">
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="bg-gray-200 border rounded p-1"
                            >
                                <option value="user">User</option>
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
