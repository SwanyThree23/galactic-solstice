import React, { useState } from 'react';
import EmbeddedPlayer from '../components/EmbeddedPlayer';
import PaymentModal from '../components/PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, MessageCircle, Share2, Maximize } from 'lucide-react';

const EmbedPage: React.FC = () => {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isChatMini, setIsChatMini] = useState(false);

    return (
        <div className="w-full h-full bg-black flex flex-col relative overflow-hidden group">
            <EmbeddedPlayer streamId="embed-001" />

            {/* Overlay Controls */}
            <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">LIVE ON CY.LIVE</span>
                    </div>
                </div>

                <div className="flex justify-between items-end pointer-events-auto">
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsPaymentOpen(true); }}
                            className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl shadow-lg transition-all"
                        >
                            <DollarSign size={20} />
                        </button>
                        <button className="bg-black/80 text-white p-3 rounded-xl transition-all border border-white/5">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsChatMini(!isChatMini)}
                            className="bg-black/80 text-white p-3 rounded-xl transition-all border border-white/5"
                        >
                            <MessageCircle size={20} />
                        </button>
                        <button className="bg-black/80 text-white p-3 rounded-xl transition-all border border-white/5">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isChatMini && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-24 right-6 w-80 h-96 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl z-30 flex flex-col"
                    >
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Chat</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto space-y-3">
                            <ChatMessage user="Alex" text="Welcome to the embed view!" />
                            <ChatMessage user="Viewer_1" text="Can I support from here?" />
                            <ChatMessage user="Alex" text="Yes! Hit the red dollar button." />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
        </div>
    );
};

const ChatMessage = ({ user, text }: any) => (
    <div className="text-[11px]">
        <span className="font-black text-red-600 uppercase italic mr-2">{user}</span>
        <span className="text-gray-300 font-medium">{text}</span>
    </div>
);

export default EmbedPage;
