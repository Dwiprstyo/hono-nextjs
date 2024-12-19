'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [responseMessage, setResponseMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            setIsError(true);
            setResponseMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.status !== 201) {
                setIsError(true);

                if (data.error === 'User already exists') {
                    setResponseMessage('User already exists');
                } else {
                    setResponseMessage(data.error || 'An unexpected error occurred');
                }
                return;
            }

            router.push('/login');
        } catch (error) {
            setIsError(true);
            setResponseMessage('An unexpected error occurred');
        }
    };
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
            <div className="w-full space-y-6 max-w-[336px]">
                <div className="text-center">
                    <p className='text-2xl font-bold'>Register</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {responseMessage && (
                        <p className={isError ? 'text-red-500 text-center' : 'text-green-500 text-center'}>
                            {responseMessage}
                        </p>
                    )}

                    <Button type="submit">
                        Register
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="text-gray-500 hover:text-gray-400 text-sm">
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}