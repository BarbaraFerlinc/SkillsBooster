import React from 'react';

function ProfileInfo({ user }) {
    return (
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
            <div className="mr-4">
                <img
                    className="w-16 h-16 rounded-full"
                    src={user.profileIcon || 'default-profile-icon.png'}
                    alt="User Profile Icon"
                />
            </div>
            <div>
                <p className="font-semibold text-lg">{user.email}</p>
                <p className="text-gray-500">********</p>
                <a href="/forgot-password" className="text-indigo-500 hover:underline">
                    Forgot password?
                </a>
            </div>
        </div>
    );
}

export default ProfileInfo;
