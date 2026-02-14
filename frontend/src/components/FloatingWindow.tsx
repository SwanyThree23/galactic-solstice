import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';

interface FloatingWindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    initialPosition?: { x: number; y: number };
    onClose?: () => void;
    onPositionChange?: (id: string, x: number, y: number) => void;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ id, title, children, initialPosition = { x: 100, y: 100 }, onClose, onPositionChange }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
                const x = info.point.x;
                const y = info.point.y;
                onPositionChange?.(id, x, y);
            }}
            initial={{ opacity: 0, scale: 0.9, x: initialPosition.x, y: initialPosition.y }}
            animate={{ opacity: 1, scale: 1 }}
            className={`fixed z-[100] bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-3xl overflow-hidden flex flex-col ${isMinimized ? 'w-64 h-12' : 'w-[400px] h-[300px]'}`}
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}
        >
            {/* Window Header / Drag Handle */}
            <div className="h-12 bg-white/[0.03] border-b border-white/5 px-4 flex items-center justify-between cursor-move group">
                <div className="flex items-center gap-3">
                    <Move size={14} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 transition-all"
                        title={isMinimized ? "Maximize" : "Minimize"}
                    >
                        {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-red-600/20 hover:text-red-500 rounded-lg text-gray-500 transition-all"
                            title="Close"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Window Content */}
            {!isMinimized && (
                <div className="flex-grow relative bg-black/40">
                    <div className="absolute inset-0 bg-radial-gradient from-red-600/5 to-transparent pointer-events-none" />
                    {children}
                </div>
            )}
        </motion.div>
    );
};

export default FloatingWindow;
