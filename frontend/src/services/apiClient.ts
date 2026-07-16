import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirect to login if unauthorized
            if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const apiClient = {
    // Auth endpoints
    login: (email: string, password: string) =>
        axiosInstance.post('/admin/login', { email, password }),
    logout: () =>
        axiosInstance.post('/admin/logout'),
    getProfile: () =>
        axiosInstance.get('/admin/profile'),
    changePassword: (data: any) =>
        axiosInstance.post('/admin/change-password', data),

    // Category endpoints
    getCategories: () =>
        axiosInstance.get('/categories'),
    createCategory: (data: any) =>
        axiosInstance.post('/admin/categories', data),
    updateCategory: (id: number, data: any) =>
        axiosInstance.put(`/admin/categories/${id}`, data),
    deleteCategory: (id: number) =>
        axiosInstance.delete(`/admin/categories/${id}`),

    // Creator endpoints
    getCreators: (categoryId?: number) => {
        const params = categoryId ? `?categoryId=${categoryId}` : '';
        return axiosInstance.get(`/creators${params}`);
    },
    createCreator: (data: FormData) =>
        axiosInstance.post('/admin/creators', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    updateCreator: (id: number, data: FormData) =>
        axiosInstance.put(`/admin/creators/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    deleteCreator: (id: number) =>
        axiosInstance.delete(`/admin/creators/${id}`),

    // Vote endpoints
    submitVote: (data: any) =>
        axiosInstance.post('/vote', data),
    getVotingStatus: () =>
        axiosInstance.get('/vote/status'),

    // Settings endpoints
    getSettings: () =>
        axiosInstance.get('/settings'),
    updateSettings: (data: any) =>
        axiosInstance.put('/settings', data),

    // Dashboard endpoints
    getDashboard: () =>
        axiosInstance.get('/admin/dashboard'),
    getVotes: (filters?: any, page?: number, limit?: number) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.creator) params.append('creator', filters.creator);
        if (filters?.isFlagged !== undefined) params.append('isFlagged', filters.isFlagged);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        return axiosInstance.get(`/admin/votes${query}`);
    },
    getVoteStatistics: () =>
        axiosInstance.get('/admin/votes/statistics'),
    exportVotes: (format: string = 'csv') =>
        axiosInstance.get(`/admin/votes/export?format=${format}`, {
            responseType: 'blob'
        }),

    // Upload endpoints
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosInstance.post('/admin/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Audit endpoints
    getAuditLogs: (filters?: any, page?: number, limit?: number) => {
        const params = new URLSearchParams();
        if (filters?.adminId) params.append('adminId', filters.adminId);
        if (filters?.action) params.append('action', filters.action);
        if (filters?.module) params.append('module', filters.module);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        return axiosInstance.get(`/admin/audit-logs${query}`);
    },
};

export default axiosInstance;
