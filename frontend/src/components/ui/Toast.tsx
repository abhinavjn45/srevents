import React, { useState } from 'react';
import { getToasts, subscribeToToasts, removeToast, ToastType } from '@/utils/toast';

interface ToastItemProps {
    id: string;
    message: string;
    type: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ id, message, type }) => {
    const bgClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div
            className={`${bgClasses[type]} text-white px-6 py-4 rounded-12 flex items-center justify-between gap-4 animate-slideIn`}
        >
            <span>{message}</span>
            <button
                onClick={() => removeToast(id)}
                className="text-white hover:opacity-75 transition"
            >
                ×
            </button>
        </div>
    );
};

export const Toaster: React.FC = () => {
    const [toasts, setToasts] = useState(getToasts());

    React.useEffect(() => {
        return subscribeToToasts(setToasts);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem {...toast} />
                </div>
            ))}
        </div>
    );
};
