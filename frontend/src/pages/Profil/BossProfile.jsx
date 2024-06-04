import React, { useState } from 'react';

const testUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', domains: [] },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'boss', domains: [] },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'employee', domains: ['Finance'] },
    { id: 4, name: 'Diana Evans', email: 'diana@example.com', role: 'employee', domains: ['HR'] },
];

const availableDomains = ['Finance', 'HR', 'IT', 'Marketing'];

function BossProfile() {
    const [users, setUsers] = useState(testUsers);

    const handleDomainChange = (userId, newDomain) => {
        setUsers(users.map(user => user.id === userId ? { ...user, domains: [newDomain] } : user));
    };

    return (
        <div className="overflow-x-auto mt-8">
            <table className="min-w-full bg-white border">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Domains</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.filter(user => user.role === 'employee').map(user => (
                    <tr key={user.id}>
                        <td className="py-2 px-4 border-b">{user.name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.domains.join(', ')}</td>
                        <td className="py-2 px-4 border-b">
                            <select
                                value={user.domains[0]}
                                onChange={(e) => handleDomainChange(user.id, e.target.value)}
                                className="bg-gray-200 border rounded p-1"
                            >
                                {availableDomains.map(domain => (
                                    <option key={domain} value={domain}>
                                        {domain}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default BossProfile;
