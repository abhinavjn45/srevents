import React from 'react';
import { Toaster } from '../ui/Toast';

interface LayoutProps {
    children: React.ReactNode;
}

export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-primary-bg text-white">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
            <Toaster />
        </div>
    );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-primary-bg text-white flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
};

const Navbar: React.FC = () => {
    return (
        <nav className="sticky top-0 z-50 bg-secondary-bg border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="text-2xl font-bold text-gold">SR Events</div>
                <div className="flex items-center gap-8">
                    <a href="#" className="text-white hover:text-gold transition">Vote</a>
                    <a href="#" className="text-white hover:text-gold transition">About</a>
                    <a href="#" className="text-white hover:text-gold transition">FAQ</a>
                </div>
            </div>
        </nav>
    );
};

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-secondary-bg border-r border-border p-6">
            <div className="text-2xl font-bold text-gold mb-12">SR Admin</div>
            <nav className="space-y-4">
                <a href="/admin" className="block px-4 py-2 rounded-12 hover:bg-card-bg transition">Dashboard</a>
                <a href="/admin/categories" className="block px-4 py-2 rounded-12 hover:bg-card-bg transition">Categories</a>
                <a href="/admin/creators" className="block px-4 py-2 rounded-12 hover:bg-card-bg transition">Creators</a>
                <a href="/admin/votes" className="block px-4 py-2 rounded-12 hover:bg-card-bg transition">Votes</a>
                <a href="/admin/settings" className="block px-4 py-2 rounded-12 hover:bg-card-bg transition">Settings</a>
            </nav>
        </aside>
    );
};

const TopBar: React.FC = () => {
    return (
        <div className="bg-secondary-bg border-b border-border px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button className="px-4 py-2 bg-gold text-gray-900 rounded-12 font-semibold hover:bg-gold-hover transition">
                Logout
            </button>
        </div>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary-bg border-t border-border py-8">
            <div className="max-w-7xl mx-auto px-6 text-center text-text-medium">
                <p>&copy; 2024 SR Events. All rights reserved.</p>
            </div>
        </footer>
    );
};
