import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    addToast: () => { },
    success: () => { },
    error: () => { },
    warning: () => { },
    info: () => { },
});

export const useToast = () => useContext(ToastContext);

const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    warning: <AlertTriangle size={18} className="text-orange-500" />,
    info: <Info size={18} className="text-blue-500" />,
};

const borderMap: Record<ToastType, string> = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-orange-500',
    info: 'border-l-blue-500',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
    const error = useCallback((msg: string) => addToast(msg, 'error', 6000), [addToast]);
    const warning = useCallback((msg: string) => addToast(msg, 'warning'), [addToast]);
    const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`pointer-events-auto bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 border-l-4 ${borderMap[toast.type]} rounded-2xl p-4 flex items-start gap-3 shadow-2xl shadow-black/60`}
                        >
                            <div className="mt-0.5 flex-shrink-0">{iconMap[toast.type]}</div>
                            <p className="text-sm font-medium text-white flex-grow leading-relaxed">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 text-gray-600 hover:text-white transition-colors mt-0.5"
                                aria-label="Dismiss notification"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
