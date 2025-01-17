'use client';

import React from 'react';

const LogoutButton: React.FC<{ accessToken: string }> = ({ accessToken }) => {
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/users/profiles', {
                method: 'DELETE',
                cache: 'no-store',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                window.location.href = '/admin/login';
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
