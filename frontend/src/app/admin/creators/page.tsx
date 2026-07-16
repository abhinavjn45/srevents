'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Base';
import { CreateCreatorForm } from '@/components/forms/Forms';
import { apiClient } from '@/services/apiClient';
import { showToast } from '@/utils/toast';

export default function CreatorsPage() {
    const [creators, setCreators] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [creatorsRes, categoriesRes] = await Promise.all([
                apiClient.getCreators(),
                apiClient.getCategories()
            ]);
            setCreators(creatorsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            showToast('Failed to load data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCreator = async (data: FormData) => {
        try {
            await apiClient.createCreator(data);
            showToast('Creator added successfully', 'success');
            loadData();
            setShowForm(false);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to add creator', 'error');
        }
    };

    const handleDeleteCreator = async (creatorId: number) => {
        if (!confirm('Are you sure?')) return;

        try {
            await apiClient.deleteCreator(creatorId);
            showToast('Creator deleted successfully', 'success');
            loadData();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to delete creator', 'error');
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Creators</h1>
                    <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add Creator'}
                    </Button>
                </div>

                {showForm && (
                    <div className="mb-8">
                        <CreateCreatorForm onSubmit={handleCreateCreator} categories={categories} />
                    </div>
                )}

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-4">Name</th>
                                    <th className="text-left p-4">Category</th>
                                    <th className="text-left p-4">Votes</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creators.map(creator => {
                                    const category = categories.find(c => c.id === creator.category_id);
                                    return (
                                        <tr key={creator.id} className="border-b border-border hover:bg-card-bg">
                                            <td className="p-4">{creator.creator_name}</td>
                                            <td className="p-4 capitalize">{category?.title || 'N/A'}</td>
                                            <td className="p-4">{creator.vote_count || 0}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-12 text-sm ${
                                                    creator.status === 'Active' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                                                }`}>
                                                    {creator.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <Button variant="secondary" size="sm">Edit</Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleDeleteCreator(creator.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
