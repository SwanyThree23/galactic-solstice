import React, { useState, useEffect } from 'react';
import { User, Shield, Camera, Lock, Video, Eye, Heart, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { userApi, analyticsApi } from '../services/api';
import VideoUpload from '../components/VideoUpload';

interface ProfileData {
    username: string;
    bio: string;
    streams: number;
    followers: string;
    joined: string;
    totalViews: number;
    videos: any[];
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [showUpload, setShowUpload] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        username: user?.username || 'AlexLivo',
        bio: 'Streaming the future of SeeWhy LIVE. 🚀',
        streams: 142,
        followers: '12.4K',
        joined: 'Jan 2026',
        totalViews: 1240000,
        videos: []
    });

    useEffect(() => {
        if (!user?.id) return;

        Promise.allSettled([
            userApi.getProfile(user.id),
            userApi.getVideos(user.id),
            analyticsApi.getCreatorStats(user.id),
        ]).then(([profileRes, videosRes, statsRes]) => {
            const updates: Partial<ProfileData> = {};
            if (profileRes.status === 'fulfilled') {
                const p = profileRes.value.data;
                updates.username = p.username || updates.username;
                updates.bio = p.bio || updates.bio;
            }
            if (videosRes.status === 'fulfilled') {
                updates.videos = videosRes.value.data;
            }
            if (statsRes.status === 'fulfilled') {
                updates.totalViews = statsRes.value.data.totalViews || 1240000;
                updates.streams = statsRes.value.data.totalStreams || 142;
            }
            setProfileData(prev => ({ ...prev, ...updates }));
        });
    }, [user]);

    const formatCount = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
        return n.toString();
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12 text-white">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent pointer-events-none" />

                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-red-600 p-1 shadow-[0_0_40px_rgba(255,59,48,0.2)]">
                        <img src={`https://ui-avatars.com/api/?name=${profileData.username}&background=222&color=fff&size=256`} className="w-full h-full rounded-full" alt="Avatar" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left relative z-10">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <h2 className="text-4xl font-black brand">{profileData.username}</h2>
                        <Shield className="text-blue-500" size={24} />
                    </div>
                    <p className="text-gray-400 mt-2 font-medium">{profileData.bio}</p>
                    <div className="flex gap-8 mt-6 justify-center md:justify-start">
                        <Stat label="Streams" count={profileData.streams} />
                        <Stat label="Followers" count={profileData.followers} />
                        <Stat label="Views" count={formatCount(profileData.totalViews)} />
                        <Stat label="Joined" count={profileData.joined} />
                    </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                    <button className="btn-primary px-8 py-3 rounded-2xl">Follow</button>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-tight transition-all"
                    >
                        <Upload size={14} />
                        Post Video
                    </button>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProfileSection title="Recent Content" icon={<Camera size={20} />}>
                    {profileData.videos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {profileData.videos.slice(0, 6).map((v: any, i: number) => (
                                <div key={v.id || i} className="aspect-video bg-black rounded-2xl overflow-hidden relative group border border-white/5 hover:border-red-600/30 transition-all cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <div className="absolute bottom-3 left-3 z-20">
                                        <p className="text-xs font-bold truncate max-w-[120px]">{v.title || `Clip ${i + 1}`}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Eye size={10} className="text-gray-500" />
                                            <span className="text-[9px] text-gray-500 font-bold">{formatCount(v.viewCount || 0)}</span>
                                        </div>
                                    </div>
                                    <Video size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="aspect-video bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-2xl border border-white/5 flex items-center justify-center group hover:border-red-600/30 transition-all cursor-pointer"
                                >
                                    <Video size={20} className="text-gray-800 group-hover:text-red-600/50 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </ProfileSection>

                <ProfileSection title="Social & Links" icon={<Lock size={20} />}>
                    <div className="space-y-4">
                        <SocialLink platform="Instagram" handle="@alex_livo" connected />
                        <SocialLink platform="Twitter / X" handle="@alex_livo" connected />
                        <SocialLink platform="TikTok" handle="@alex_livo" connected />
                        <SocialLink platform="YouTube" handle="Not Connected" />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <MiniStat label="Avg Watch" value="4m 22s" />
                            <MiniStat label="Engagement" value="8.4%" />
                            <MiniStat label="Revenue" value="$2.4K" />
                            <MiniStat label="AI Clips" value="38" />
                        </div>
                    </div>
                </ProfileSection>
            </div>

            <VideoUpload isOpen={showUpload} onClose={() => setShowUpload(false)} />
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
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-8 space-y-6"
    >
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="text-red-600">{icon}</div>
            <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const SocialLink = ({ platform, handle, connected = false }: any) => (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-600/30 transition-colors group">
        <span className="text-xs font-bold uppercase tracking-tight text-gray-400">{platform}</span>
        <div className="flex items-center gap-3">
            <span className={`text-sm font-black ${connected ? 'text-white' : 'text-gray-600'}`}>{handle}</span>
            {connected && (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
            )}
        </div>
    </div>
);

const MiniStat = ({ label, value }: any) => (
    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black mt-1">{value}</p>
    </div>
);

export default Profile;
