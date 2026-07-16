'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/Layout';
import { Card, Button } from '@/components/ui/Base';
import { CreateCategoryForm } from '@/components/forms/Forms';
import { apiClient } from '@/services/apiClient';
import { showToast } from '@/utils/toast';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.getCategories();
            setCategories(response.data.data);
        } catch (error) {
            showToast('Failed to load categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCategory = async (data: any) => {
        try {
            await apiClient.createCategory(data);
            showToast('Category created successfully', 'success');
            loadCategories();
            setShowForm(false);
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to create category', 'error');
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (!confirm('Are you sure?')) return;

        try {
            await apiClient.deleteCategory(categoryId);
            showToast('Category deleted successfully', 'success');
            loadCategories();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to delete category', 'error');
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Categories</h1>
                    <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Create Category'}
                    </Button>
                </div>

                {showForm && (
                    <div className="mb-8">
                        <CreateCategoryForm onSubmit={handleCreateCategory} />
                    </div>
                )}

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(category => (
                            <Card key={category.id}>
                                <h3 className="text-xl font-semibold mb-2 capitalize">{category.title}</h3>
                                <p className="text-text-medium text-sm mb-4">{category.creator_count} creators</p>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" className="flex-1">
                                        Edit
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleDeleteCategory(category.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
