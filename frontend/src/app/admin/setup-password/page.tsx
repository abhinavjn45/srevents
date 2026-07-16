'use client';

import React, { useState } from 'react';
import { PublicLayout } from '@/components/layout/Layout';
import { SetupPasswordForm } from '@/components/forms/Forms';
import { apiClient } from '@/services/apiClient';

import { showToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';

export default function SetupPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    


    const handleSetupPassword = async (data: { currentPassword: string; newPassword: string }) => {
        setIsLoading(true);
        try {
            await apiClient.changePassword(data);
            showToast('Password updated successfully', 'success');
            
            // Wait a bit before redirecting so toast is seen
            setTimeout(() => {
                router.push('/admin');
            }, 1000);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to update password', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center px-4">
                <SetupPasswordForm onSubmit={handleSetupPassword} isLoading={isLoading} />
            </div>
        </PublicLayout>
    );
}
