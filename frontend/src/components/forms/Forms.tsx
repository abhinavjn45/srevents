import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, Button, Input } from '../ui/Base';

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => Promise<void>;
    isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    return (
        <Card className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="admin@example.com"
                    error={errors.email?.message?.toString()}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email'
                        }
                    })}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message?.toString()}
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        }
                    })}
                />

                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Card>
    );
};

interface CreateCategoryFormProps {
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({ onSubmit, isLoading = false }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-6">Create Category</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="Best Tech Creator"
                    error={errors.title?.message?.toString()}
                    {...register('title', { required: 'Title is required' })}
                />

                <Input
                    label="Description"
                    placeholder="Category description"
                    error={errors.description?.message?.toString()}
                    {...register('description')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Voting Start"
                        type="datetime-local"
                        error={errors.votingStart?.message?.toString()}
                        {...register('votingStart')}
                    />
                    <Input
                        label="Voting End"
                        type="datetime-local"
                        error={errors.votingEnd?.message?.toString()}
                        {...register('votingEnd')}
                    />
                </div>

                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Category'}
                </Button>
            </form>
        </Card>
    );
};

interface SetupPasswordFormProps {
    onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    isLoading?: boolean;
}

export const SetupPasswordForm: React.FC<SetupPasswordFormProps> = ({ onSubmit, isLoading = false }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const newPassword = watch('newPassword');

    return (
        <Card className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Setup New Password</h2>
            <p className="text-text-medium mb-6 text-sm">
                For security reasons, you must change the default password before accessing the dashboard.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.currentPassword?.message?.toString()}
                    {...register('currentPassword', {
                        required: 'Current password is required',
                    })}
                />

                <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.newPassword?.message?.toString()}
                    {...register('newPassword', {
                        required: 'New password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: 'Must include uppercase, lowercase, number, and special character'
                        }
                    })}
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message?.toString()}
                    {...register('confirmPassword', {
                        required: 'Please confirm your new password',
                        validate: value => value === newPassword || 'Passwords do not match'
                    })}
                />

                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
            </form>
        </Card>
    );
};

interface CreateCreatorFormProps {
    onSubmit: (data: FormData) => Promise<void>;
    categories: any[];
    isLoading?: boolean;
}

export const CreateCreatorForm: React.FC<CreateCreatorFormProps> = ({ onSubmit, categories, isLoading = false }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleFormSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('creatorName', data.creatorName);
        formData.append('categoryId', data.categoryId);
        if (data.bio) formData.append('bio', data.bio);
        if (data.instagram) formData.append('instagram', data.instagram);
        if (data.youtube) formData.append('youtube', data.youtube);
        if (data.image && data.image[0]) {
            formData.append('image', data.image[0]);
        }
        await onSubmit(formData);
    };

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-6">Add Creator</h3>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Input
                    label="Creator Name"
                    placeholder="Jane Doe"
                    error={errors.creatorName?.message?.toString()}
                    {...register('creatorName', { required: 'Name is required' })}
                />

                <div className="w-full">
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <select
                        className={`w-full px-4 py-3 bg-secondary-bg border rounded-12 text-white focus:outline-none focus:border-gold transition-colors ${
                            errors.categoryId ? 'border-red-500' : 'border-border'
                        }`}
                        {...register('categoryId', { required: 'Category is required' })}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="mt-2 text-sm text-red-500">{errors.categoryId.message?.toString()}</p>}
                </div>

                <Input
                    label="Bio (Optional)"
                    placeholder="Creator bio"
                    {...register('bio')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Instagram (Optional)"
                        placeholder="@username"
                        {...register('instagram')}
                    />
                    <Input
                        label="YouTube (Optional)"
                        placeholder="@channel"
                        {...register('youtube')}
                    />
                </div>

                <div className="w-full">
                    <label className="block text-sm font-medium text-white mb-2">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={`w-full px-4 py-3 bg-secondary-bg border rounded-12 text-white focus:outline-none focus:border-gold transition-colors ${
                            errors.image ? 'border-red-500' : 'border-border'
                        }`}
                        {...register('image', { required: 'Image is required' })}
                    />
                    {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image.message?.toString()}</p>}
                </div>

                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Creator'}
                </Button>
            </form>
        </Card>
    );
};
