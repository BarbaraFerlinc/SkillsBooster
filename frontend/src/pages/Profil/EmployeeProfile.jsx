import React from 'react';
import { Users } from "../../Data.jsx";

function EmployeeProfile({ userId }) {
    const user = Users.find(user => user.id === userId);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">My Domains</h2>
            {user.domains.map((domain, index) => {
                const progress = domain.progress; // Assuming domain object has a progress property
                return (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold">{domain.name}</h3>
                        <div className="flex items-center mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">{progress}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default EmployeeProfile;
