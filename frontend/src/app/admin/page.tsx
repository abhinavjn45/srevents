'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/Layout';
import { DashboardCard } from '@/components/cards/Cards';
import { apiClient } from '@/services/apiClient';
import { showToast } from '@/utils/toast';

export default function AdminDashboard() {
    const [dashboard, setDashboard] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.getDashboard();
            setDashboard(response.data.data);
        } catch (error) {
            showToast('Failed to load dashboard', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard
                        title="Total Votes"
                        value={dashboard?.totalVotes || 0}
                        icon="🗳️"
                    />
                    <DashboardCard
                        title="Today's Votes"
                        value={dashboard?.todayVotes || 0}
                        icon="📊"
                    />
                    <DashboardCard
                        title="Categories"
                        value={dashboard?.categories || 0}
                        icon="🏆"
                    />
                    <DashboardCard
                        title="Creators"
                        value={dashboard?.creators || 0}
                        icon="⭐"
                    />
                    <DashboardCard
                        title="Flagged Votes"
                        value={dashboard?.flaggedVotes || 0}
                        icon="🚩"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
