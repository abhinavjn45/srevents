// Toast notifications
export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

export const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast-${++toastId}`;
    const toast: Toast = { id, message, type, duration };
    
    toasts.push(toast);
    notifyListeners();
    
    if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
    }
    
    return id;
};

export const removeToast = (id: string) => {
    const index = toasts.findIndex(t => t.id === id);
    if (index > -1) {
        toasts.splice(index, 1);
        notifyListeners();
    }
};

export const getToasts = (): Toast[] => [...toasts];

export const subscribeToToasts = (listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
        listeners.splice(listeners.indexOf(listener), 1);
    };
};

const notifyListeners = () => {
    listeners.forEach(listener => listener([...toasts]));
};
