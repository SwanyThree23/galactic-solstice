import React, { useState, useCallback } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Wallet, Monitor, Globe, User, Check, AlertTriangle, Zap, Radio, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-morphism p-10 space-y-8"
                        >
                            <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-white/5 pb-6">{activeSection} Settings</h3>

                            {activeSection === 'Production' && <ProductionSettings />}
                            {activeSection === 'Financials' && <FinancialSettings />}
                            {activeSection === 'Profile' && <ProfileSettings />}
                            {activeSection === 'Security' && <SecuritySettings />}
                            {activeSection === 'Notifications' && <NotificationSettings />}
                            {activeSection === 'Social' && <SocialSettings />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// ── Production Settings ──
const ProductionSettings: React.FC = () => {
    const storageKey = 'yliv_settings_production';
    const defaults = { lowLatency: true, aiClipping: true, multiStream: false, aiDirector: true, autoRecord: false };
    const [settings, setSettings] = useState(() => {
        try { return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
        catch { return defaults; }
    });

    const toggle = useCallback((key: string) => {
        setSettings((prev: any) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    }, []);

    return (
        <div className="space-y-6">
            <ToggleSetting title="Ultra-Low Latency" desc="Prioritize 20 xeron performance over resolution." active={settings.lowLatency} onToggle={() => toggle('lowLatency')} icon={<Zap size={16} className="text-green-500" />} />
            <ToggleSetting title="Auto AI Clipping" desc="Allow K2 Swarm to automatically extract highlights." active={settings.aiClipping} onToggle={() => toggle('aiClipping')} icon={<Zap size={16} className="text-orange-500" />} />
            <ToggleSetting title="Multi-Stream Default" desc="Auto-relay to YouTube and Twitch on start." active={settings.multiStream} onToggle={() => toggle('multiStream')} icon={<Radio size={16} className="text-purple-500" />} />
            <ToggleSetting title="AI Director Mode" desc="Let K2 auto-switch scenes based on engagement." active={settings.aiDirector} onToggle={() => toggle('aiDirector')} icon={<Users size={16} className="text-blue-500" />} />
            <ToggleSetting title="Auto Record" desc="Record all streams for VOD automatically." active={settings.autoRecord} onToggle={() => toggle('autoRecord')} icon={<Monitor size={16} className="text-red-500" />} />
        </div>
    );
};

// ── Financial Settings ──
const FinancialSettings: React.FC = () => (
    <div className="space-y-6">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Connected Payout Gateways</p>
        <div className="grid grid-cols-2 gap-4">
            <Gateway label="CashApp" status="Verified" />
            <Gateway label="PayPal" status="Verified" />
            <Gateway label="Venmo" status="Verified" />
            <Gateway label="Zelle" status="Action Required" warning />
        </div>
        <div className="pt-6 border-t border-white/5 space-y-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Revenue Split</p>
            <div className="flex items-center gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
                <div className="text-center">
                    <p className="text-3xl font-black text-red-600">90%</p>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Creator</p>
                </div>
                <div className="flex-grow h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-red-600 to-orange-500 rounded-full" />
                </div>
                <div className="text-center">
                    <p className="text-xl font-black text-gray-500">10%</p>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Platform</p>
                </div>
            </div>
        </div>
    </div>
);

// ── Profile Settings ──
const ProfileSettings: React.FC = () => {
    const [bio, setBio] = useState('Streaming the future of YLIV 4.0. 🚀');
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="settings-display-name" className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Display Name</label>
                <input id="settings-display-name" type="text" defaultValue="AlexLivo" placeholder="Your display name" className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-sm focus:border-red-600/50 outline-none" />
            </div>
            <div>
                <label htmlFor="settings-bio" className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Bio</label>
                <textarea id="settings-bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell viewers about yourself" className="w-full bg-black border border-white/5 rounded-2xl py-4 px-5 text-sm focus:border-red-600/50 outline-none resize-none" />
            </div>
            <button className="btn-primary px-8 py-3">Save Changes</button>
        </div>
    );
};

// ── Security Settings ──
const SecuritySettings: React.FC = () => {
    const storageKey = 'yliv_settings_security';
    const defaults = { twoFactor: false, loginAlerts: true };
    const [settings, setSettings] = useState(() => {
        try { return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
        catch { return defaults; }
    });
    const toggle = (key: string) => {
        setSettings((prev: any) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="space-y-6">
            <ToggleSetting title="Two-Factor Authentication" desc="Require 2FA for login and withdrawals." active={settings.twoFactor} onToggle={() => toggle('twoFactor')} />
            <ToggleSetting title="Login Alerts" desc="Get notified when a new device signs in." active={settings.loginAlerts} onToggle={() => toggle('loginAlerts')} />
            <div className="pt-6 border-t border-white/5">
                <button className="text-red-500 text-xs font-black uppercase tracking-widest hover:text-red-400 transition-colors">Change Password →</button>
            </div>
        </div>
    );
};

// ── Notification Settings ──
const NotificationSettings: React.FC = () => {
    const storageKey = 'yliv_settings_notifications';
    const defaults = { donations: true, followers: true, streamAlerts: true, aiAlerts: false };
    const [settings, setSettings] = useState(() => {
        try { return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
        catch { return defaults; }
    });
    const toggle = (key: string) => {
        setSettings((prev: any) => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="space-y-6">
            <ToggleSetting title="Donation Alerts" desc="Real-time notifications for all incoming donations." active={settings.donations} onToggle={() => toggle('donations')} />
            <ToggleSetting title="New Followers" desc="Get alerted when someone follows your channel." active={settings.followers} onToggle={() => toggle('followers')} />
            <ToggleSetting title="Stream Performance" desc="End-of-stream analytics summaries." active={settings.streamAlerts} onToggle={() => toggle('streamAlerts')} />
            <ToggleSetting title="AI Director Reports" desc="Get notified when K2 makes scene changes." active={settings.aiAlerts} onToggle={() => toggle('aiAlerts')} />
        </div>
    );
};

// ── Social Settings ──
const SocialSettings: React.FC = () => (
    <div className="space-y-4">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Connected Accounts</p>
        <SocialAccount platform="Instagram" handle="@alex_livo" connected />
        <SocialAccount platform="Twitter / X" handle="@alex_livo" connected />
        <SocialAccount platform="TikTok" handle="@alex_livo" connected />
        <SocialAccount platform="YouTube" handle="Not connected" />
        <SocialAccount platform="LinkedIn" handle="Not connected" />
    </div>
);

// ── Shared Components ──
const ToggleSetting = ({ title, desc, active = false, onToggle, icon }: any) => (
    <div className="flex justify-between items-center group cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3">
            {icon && <div className="mt-0.5">{icon}</div>}
            <div>
                <p className="font-bold text-sm group-hover:text-red-600 transition-colors uppercase italic">{title}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{desc}</p>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${active ? 'bg-red-600' : 'bg-white/10'}`}>
            <motion.div
                animate={{ x: active ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-lg"
            />
        </div>
    </div>
);

const Gateway = ({ label, status, warning = false }: any) => (
    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl flex justify-between items-center group hover:border-red-600/30 transition-colors">
        <span className="text-xs font-black">{label}</span>
        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 ${warning ? 'bg-orange-600/20 text-orange-600' : 'bg-green-600/20 text-green-600'}`}>
            {warning ? <AlertTriangle size={10} /> : <Check size={10} />}
            {status}
        </span>
    </div>
);

const SocialAccount = ({ platform, handle, connected = false }: any) => (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-600/30 transition-colors">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-700'}`} />
            <span className="text-xs font-bold uppercase tracking-tight text-gray-400">{platform}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className={`text-sm font-black ${connected ? 'text-white' : 'text-gray-600'}`}>{handle}</span>
            {!connected && (
                <button className="text-[9px] font-black text-red-600 uppercase tracking-tight hover:text-red-400">Connect</button>
            )}
        </div>
    </div>
);

export default Settings;
