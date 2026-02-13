import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Send, Copy, X, Check, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentId: string;
    shareId: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, contentId, shareId }) => {
    const [copied, setCopied] = useState(false);
    const embedUrl = `https://cy.live/embed/r/${contentId}`;
    const deepLink = `cy.live/DL/tag/stream/bash/${contentId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold tracking-tight">Share Experience</h3>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <SocialIcon icon={<Instagram />} label="Story" color="#E4405F" />
                                <SocialIcon icon={<Facebook />} label="Feed" color="#1877F2" />
                                <SocialIcon icon={<Twitter />} label="Post" color="#1DA1F2" />
                                <SocialIcon icon={<Send />} label="Telegram" color="#0088cc" />
                            </div>

                            <div className="space-y-4">
                                <div className="group relative">
                                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Web Embed Link</p>
                                    <div className="flex items-center gap-2 bg-black p-3 rounded-xl border border-white/5 group-hover:border-red-500/50 transition-colors">
                                        <input
                                            readOnly
                                            value={embedUrl}
                                            className="bg-transparent border-none text-sm text-gray-400 focus:outline-none flex-grow"
                                        />
                                        <button onClick={copyToClipboard} className="text-red-500 hover:text-red-400">
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Mobile Deep Link</p>
                                    <div className="flex items-center gap-2 bg-black p-3 rounded-xl border border-white/5">
                                        <Smartphone size={16} className="text-gray-500" />
                                        <span className="text-sm text-gray-400 truncate">{deepLink}</span>
                                        <button className="text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-lg ml-auto">
                                            OPEN APP
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-600/10 p-4 text-center border-t border-red-500/20">
                            <p className="text-xs font-medium text-red-500">Watching from shared links increases creator 90% revenue!</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const SocialIcon = ({ icon, label, color }: any) => (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
            {React.cloneElement(icon, { style: { color } })}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
    </div>
);

export default ShareModal;
