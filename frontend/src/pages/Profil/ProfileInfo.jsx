import React from 'react';

function ProfileInfo({ user }) {
    return (
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
            <div>
                <p className="font-semibold text-lg">{user?.email}</p>
                <a href="/forgot-password" className="text-indigo-500 hover:underline">
                    Change password?
                </a>
            </div>
        </div>
    );
}

export default ProfileInfo;
