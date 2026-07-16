import React from 'react';
import { Toaster } from '../ui/Toast';

interface LayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
}

export const PublicLayout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
    return (
        <div className="min-h-screen bg-primary-bg text-white">
            <Navbar />
            <main>
                {children}
            </main>
            {showFooter && <Footer />}
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
        <div className="fixed top-0 left-0 right-0 z-50 pt-6 px-4 md:px-8">
            <nav className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-4 flex items-center justify-between transition-all duration-300">
                <div className="text-2xl font-bold font-playfair tracking-wider">
                    <span className="text-white">SR</span> <span className="text-gold">Events</span>
                </div>
                <div className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase">
                    <a href="#" className="text-text-light hover:text-white relative group transition-colors">
                        VOTE
                        <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                    </a>
                    <a href="#" className="text-text-light hover:text-white relative group transition-colors">
                        ABOUT
                        <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                    </a>
                    <a href="#" className="text-text-light hover:text-white relative group transition-colors">
                        FAQ
                        <span className="absolute -bottom-2 left-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100"></span>
                    </a>
                </div>
            </nav>
        </div>
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
        <footer className="bg-secondary-bg border-t border-white/5 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                <p className="text-white/60 tracking-[0.3em] uppercase text-[10px] font-semibold mb-3">Proudly Sponsored By</p>
                <div className="text-xl font-bold font-playfair tracking-widest text-gold mb-1">
                    Connecting Scripts
                </div>
                <p className="text-gold/70 tracking-[0.2em] uppercase text-[8px] font-medium">Digital Marketing Agency</p>
            </div>
        </footer>
    );
};
