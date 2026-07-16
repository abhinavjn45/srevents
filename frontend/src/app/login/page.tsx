'use client';

import React, { useState } from 'react';
import { PublicLayout } from '@/components/layout/Layout';
import { LoginForm } from '@/components/forms/Forms';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/hooks/useAuthStore';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const setAdmin = useAuthStore(state => state.setAdmin);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            const response = await apiClient.login(data.email, data.password);
            const adminData = response.data.data;
            setAdmin(adminData);
            showToast('Login successful', 'success');
            if (adminData.requiresPasswordChange) {
                router.push('/admin/setup-password');
            } else {
                router.push('/admin');
            }
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Login failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center px-4">
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
            </div>
        </PublicLayout>
    );
}
