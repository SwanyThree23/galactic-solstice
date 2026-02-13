import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Wallet, Monitor, Globe, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Production');

    const sections = [
        { name: 'Production', icon: <Monitor size={20} /> },
        { name: 'Financials', icon: <Wallet size={20} /> },
        { name: 'Profile', icon: <User size={20} /> },
        { name: 'Security', icon: <Shield size={20} /> },
        { name: 'Notifications', icon: <Bell size={20} /> },
        { name: 'Social', icon: <Globe size={20} /> },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto text-white">
            <header className="mb-12">
                <h2 className="text-4xl font-black brand italic tracking-tighter uppercase">Studio <span className="text-red-600">Preferences</span></h2>
                <p className="text-gray-500 font-medium mt-1">Configure your YLIV 4.0 production environment.</p>
            </header>

            <div className="flex gap-12">
                <aside className="w-64 space-y-2">
                    {sections.map(s => (
                        <button
                            key={s.name}
                            onClick={() => setActiveSection(s.name)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeSection === s.name ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:bg-white/5'}`}
                        >
                            {s.icon}
                            {s.name}
                        </button>
                    ))}
                </aside>

                <main className="flex-grow space-y-8">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-morphism p-10 space-y-8"
                    >
                        <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-white/5 pb-6">{activeSection} Settings</h3>

                        {activeSection === 'Production' && (
                            <div className="space-y-6">
                                <ToggleSetting title="Ultra-Low Latency" desc="Prioritize 20 xeron performance over resolution." active />
                                <ToggleSetting title="Auto AI Clipping" desc="Allow K2 Swarm to automatically extract highlights." active />
                                <ToggleSetting title="Multi-Stream Default" desc="Auto-relay to YouTube and Twitch on start." />
                            </div>
                        )}

                        {activeSection === 'Financials' && (
                            <div className="space-y-6">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Connected Payout Gateways</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Gateway label="CashApp" status="Verified" />
                                    <Gateway label="PayPal" status="Verified" />
                                    <Gateway label="Zelle" status="Action Required" warning />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

const ToggleSetting = ({ title, desc, active = false }: any) => (
    <div className="flex justify-between items-center group">
        <div>
            <p className="font-bold text-sm group-hover:text-red-600 transition-colors uppercase italic">{title}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{desc}</p>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-all ${active ? 'bg-red-600' : 'bg-white/10'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-all ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

const Gateway = ({ label, status, warning = false }: any) => (
    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-red-600/30 transition-colors">
        <span className="text-xs font-black">{label}</span>
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${warning ? 'bg-orange-600/20 text-orange-600' : 'bg-green-600/20 text-green-600'}`}>
            {status}
        </span>
    </div>
);

export default Settings;
