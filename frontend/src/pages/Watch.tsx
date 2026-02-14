import React, { useState, useEffect } from 'react';
import ChatPanel from '../components/ChatPanel';
import EmbeddedPlayer from '../components/EmbeddedPlayer';
import PaymentModal from '../components/PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Share2, Users, Radio, Maximize, Heart } from 'lucide-react';
import FloatingWindow from '../components/FloatingWindow';
import { useSocket } from '../hooks/useSocket';

const Watch: React.FC = () => {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isPiPOpen, setIsPiPOpen] = useState(false);
    const [lastDonation, setLastDonation] = useState<any>(null);
    const { socket } = useSocket();
    const streamId = "cy-live-prod-001";

    useEffect(() => {
        if (!socket) return;
        socket.emit('join_stream', streamId);

        const handleDonation = (data: any) => {
            setLastDonation(data);
            setTimeout(() => setLastDonation(null), 8000);
        };

        socket.on('alert_donation', handleDonation);
        return () => {
            socket.off('alert_donation', handleDonation);
        };
    }, [socket]);

    return (
        <div className="flex h-screen flex-col bg-[#050505] text-white overflow-hidden">
            {/* Minimal Watch Header */}
            <header className="h-14 border-b border-white/5 bg-black/50 backdrop-blur-md px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Radio className="text-red-600 animate-pulse" size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] italic">CY LIVE <span className="text-red-600">WATCH</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Users size={14} />
                        <span className="text-[10px] font-black tracking-widest uppercase">2.4K WATCHING</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow relative">
                {/* Cinema View */}
                <main className="flex-grow flex flex-col p-6 gap-6 overflow-y-auto">
                    <div className="w-full max-w-6xl mx-auto space-y-6">
                        <div className={`transition-opacity duration-500 ${isPiPOpen ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
                            <EmbeddedPlayer streamId="watch-now-1" />
                        </div>

                        <div className="flex justify-between items-start pt-4">
                            <div>
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Elite Strategy Session: SeeWhy LIVE Pro</h1>
                                <p className="text-gray-400 font-medium mt-2">Streaming with AlexLivo + 8 Guests • 20 Xeron Latency</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsPiPOpen(true)}
                                    title="Popout Player"
                                    className={`glass-morphism p-3 hover:bg-white/10 transition-all border border-white/10 ${isPiPOpen ? 'text-red-600' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <Maximize size={24} />
                                </button>
                                <button title="Share stream" className="glass-morphism p-3 hover:bg-white/10 transition-all border border-white/10 text-gray-400 hover:text-white">
                                    <Share2 size={24} />
                                </button>
                                <button
                                    onClick={() => setIsPaymentOpen(true)}
                                    className="btn-primary px-8 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-600/20"
                                >
                                    <DollarSign size={20} />
                                    SUPPORT CREATOR
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                            <h3 className="text-sm font-black uppercase tracking-widest text-red-600 mb-4">Stream Description</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                Join the elite circle as we demonstrate the full capabilities of the SeeWhy LIVE platform.
                                We're testing the 9+ guest expandable grid and the AI director swarm. Don't miss the viral clips!
                            </p>
                        </div>
                    </div>
                </main>

                {/* Vertical Chat */}
                <aside className="w-96 border-l border-white/5 bg-[#0a0a0a]">
                    <ChatPanel />
                </aside>
            </div>

            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} streamId={streamId} />

            {/* Donation Alert Overlay */}
            <AnimatePresence>
                {lastDonation && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ x: 100, opacity: 0, scale: 0.8 }}
                        className="fixed bottom-12 left-12 z-[500] pointer-events-none"
                    >
                        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-1 rounded-[2.5rem] shadow-[0_0_80px_rgba(245,158,11,0.5)]">
                            <div className="bg-black/95 backdrop-blur-3xl rounded-[2.4rem] px-10 py-6 flex items-center gap-6 border border-white/10">
                                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Heart size={40} className="text-black" fill="black" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-yellow-500 uppercase tracking-[0.3em] mb-1">New Support!</h4>
                                    <p className="text-4xl font-black italic tracking-tighter uppercase whitespace-nowrap">
                                        ${lastDonation.amount} <span className="text-gray-400 font-bold text-xl ml-2">from {lastDonation.sender}</span>
                                    </p>
                                    <p className="text-sm font-bold text-gray-500 mt-1">"{lastDonation.message}"</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PiP Floating Window */}
            <AnimatePresence>
                {isPiPOpen && (
                    <FloatingWindow
                        id="watch-pip"
                        title="Mini Player — SeeWhy LIVE"
                        initialPosition={{ x: window.innerWidth - 450, y: window.innerHeight - 350 }}
                        onClose={() => setIsPiPOpen(false)}
                    >
                        <div className="w-full h-full bg-black group relative">
                            <EmbeddedPlayer streamId="watch-now-1-pip" />
                            <div className="absolute top-2 left-2 pointer-events-none">
                                <div className="bg-red-600 px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white">LIVE PiP</div>
                            </div>
                        </div>
                    </FloatingWindow>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Watch;
