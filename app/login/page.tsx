'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [responseMessage, setResponseMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setIsError(false);
        setResponseMessage('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (res.ok) {
                router.push('/');
                return;
            }

            setIsError(true);
            const data = await res.json();
            if (data.status === 401) {
                setResponseMessage(data.error);
            } else {
                setResponseMessage(data.error || 'An unexpected error occurred');
            }
        } catch {
            setIsError(true);
            setResponseMessage('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
            <div className="w-full space-y-6 max-w-[336px]">
                <div className="text-center">
                    <p className='text-2xl font-bold'>Login</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        name="email"
                        placeholder="Email or Username"
                        value={formData.email}
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

                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="spinner"></div>
                                <span className="ml-2">Loading...</span>
                            </div>
                        ) : (
                            'Log in'
                        )}
                    </Button>

                    <div className="text-center">
                        <Link href="/register" className="text-gray-500 hover:text-gray-400 text-sm">
                            Register?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}