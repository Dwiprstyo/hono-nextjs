'use client';

import React from 'react';

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'GET',
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-400 text-sm mt-2 focus:outline-none"
        >
            Logout?
        </button>
    );
};

export default LogoutButton;
