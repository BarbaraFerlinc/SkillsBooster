import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { UserAuth } from '../../context/AuthContext.jsx';

function AdminProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);

    const { user, createUser } = UserAuth();

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
        const fetchUporabniki = async () => {
            try {
                const response = await api.post('/uporabnik/adminEmail', { adminEmail: currentUser.email });
                setUsers(response.data);
            } catch (er) {
                console.log("Napaka pri pridobivanju uporabnikov", er);
            }
        }
    
        fetchUporabniki();
    }, [currentUser]);

    return (
        <div className="overflow-x-auto mt-8">
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
