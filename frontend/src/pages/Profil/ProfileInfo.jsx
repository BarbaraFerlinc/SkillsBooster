import React from 'react';

function ProfileInfo({ user }) {
    return (
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
            <div>
                <p className="font-semibold text-lg text-black">{user?.email}</p>
                <a href="/reset" className="text-indigo-500 hover:underline">
                    Change password?
                </a>
            </div>
        </div>
    );
}

export default ProfileInfo;
