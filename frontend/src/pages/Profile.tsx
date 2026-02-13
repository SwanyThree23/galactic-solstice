import React, { useState } from 'react';
import { User, Shield, Camera, Link, Bell, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
    const [user] = useState({
        username: 'AlexLivo',
        bio: 'Streaming the future of YLIV 4.0. 🚀',
        streams: 142,
        followers: '12.4K',
        joined: 'Jan 2026'
    });

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-8 bg-white/5 p-10 rounded-[3rem] border border-white/5">
                <div className="w-32 h-32 rounded-full border-4 border-red-600 p-1">
                    <img src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} className="w-full h-full rounded-full" alt="Avatar" />
                </div>
                <div className="flex-grow">
                    <div className="flex items-center gap-3">
                        <h2 className="text-4xl font-black brand">{user.username}</h2>
                        <Shield className="text-blue-500" size={24} />
                    </div>
                    <p className="text-gray-400 mt-2 font-medium">{user.bio}</p>
                    <div className="flex gap-6 mt-6">
                        <Stat label="Streams" count={user.streams} />
                        <Stat label="Followers" count={user.followers} />
                        <Stat label="Joined" count={user.joined} />
                    </div>
                </div>
                <button className="btn-primary px-8 py-3 h-fit rounded-2xl">Follow</button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileSection title="Recent Content" icon={<Camera size={20} />}>
                    <div className="grid grid-cols-2 gap-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-video bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </ProfileSection>

                <ProfileSection title="Security & Links" icon={<Lock size={20} />}>
                    <div className="space-y-4">
                        <SocialLink platform="Instagram" handle="@alex_livo" />
                        <SocialLink platform="Twitter" handle="@alex_livo" />
                        <SocialLink platform="TikTok" handle="@alex_livo" />
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
};

const Stat = ({ label, count }: any) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{label}</span>
        <span className="text-xl font-black">{count}</span>
    </div>
);

const ProfileSection = ({ title, icon, children }: any) => (
    <div className="glass-morphism p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="text-red-600">{icon}</div>
            <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
        </div>
        {children}
    </div>
);

const SocialLink = ({ platform, handle }: any) => (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-600/30 transition-colors">
        <span className="text-xs font-bold uppercase tracking-tight text-gray-400">{platform}</span>
        <span className="text-sm font-black">{handle}</span>
    </div>
);

export default Profile;
