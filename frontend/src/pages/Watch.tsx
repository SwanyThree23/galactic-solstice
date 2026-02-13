import React, { useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import EmbeddedPlayer from '../components/EmbeddedPlayer';
import PaymentModal from '../components/PaymentModal';
import { motion } from 'framer-motion';
import { DollarSign, Share2, Users, Radio } from 'lucide-react';

const Watch: React.FC = () => {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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

            <div className="flex flex-grow">
                {/* Cinema View */}
                <main className="flex-grow flex flex-col p-6 gap-6 overflow-y-auto">
                    <div className="w-full max-w-6xl mx-auto space-y-6">
                        <EmbeddedPlayer streamId="watch-now-1" />

                        <div className="flex justify-between items-start pt-4">
                            <div>
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Elite Strategy Session: YLIV 4.0 Pro</h1>
                                <p className="text-gray-400 font-medium mt-2">Streaming with AlexLivo + 8 Guests • 20 Xeron Latency</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="glass-morphism p-3 hover:bg-white/10 transition-all border border-white/10">
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

            <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
        </div>
    );
};

export default Watch;
