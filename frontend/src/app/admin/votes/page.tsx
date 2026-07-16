'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/ui/Base';
import { apiClient } from '@/services/apiClient';
import { showToast } from '@/utils/toast';

export default function VotesPage() {
    const [votes, setVotes] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadVotes();
    }, [pagination.page]);

    const loadVotes = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.getVotes({}, pagination.page, pagination.limit);
            setVotes(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            showToast('Failed to load votes', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await apiClient.exportVotes('csv');
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `votes-${new Date().toISOString()}.csv`);
            document.body.appendChild(link);
            link.click();
            showToast('Votes exported successfully', 'success');
        } catch (error) {
            showToast('Failed to export votes', 'error');
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Votes</h1>
                    <Button variant="primary" onClick={handleExport}>
                        Export CSV
                    </Button>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="overflow-x-auto mb-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-4">ID</th>
                                        <th className="text-left p-4">Category</th>
                                        <th className="text-left p-4">Creator</th>
                                        <th className="text-left p-4">IP Address</th>
                                        <th className="text-left p-4">Risk Score</th>
                                        <th className="text-left p-4">Flagged</th>
                                        <th className="text-left p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {votes.map(vote => (
                                        <tr key={vote.id} className="border-b border-border hover:bg-card-bg">
                                            <td className="p-4 text-sm">{vote.id}</td>
                                            <td className="p-4 text-sm">{vote.category_title}</td>
                                            <td className="p-4 text-sm">{vote.creator_name}</td>
                                            <td className="p-4 text-sm font-mono text-xs">{vote.ip_address}</td>
                                            <td className="p-4 text-sm">{vote.risk_score}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-12 text-sm ${
                                                    vote.is_flagged ? 'bg-red-500 bg-opacity-20 text-red-400' : 'bg-green-500 bg-opacity-20 text-green-400'
                                                }`}>
                                                    {vote.is_flagged ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">{new Date(vote.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-text-medium">
                                Page {pagination.page} of {pagination.pages} ({pagination.total} total votes)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    disabled={pagination.page === 1}
                                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="secondary"
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
