import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Zap, Shield, Heart, Radio, Users, Cpu, ArrowRight, Globe, DollarSign, Sparkles } from 'lucide-react';
import LivePreviewCard from '../components/LivePreviewCard';

const Home: React.FC = () => {
    const [viewerCount, setViewerCount] = useState(24819);

    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(prev => prev + Math.floor(Math.random() * 7 - 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-red-600/15 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-orange-600/15 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-purple-600/10 blur-[120px] rounded-full" />

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Live Indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-full mb-8"
                    >
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">{viewerCount.toLocaleString()} Creators Streaming Now</span>
                    </motion.div>

                    <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter brand leading-none">
                        SeeWhy <span className="text-red-600">LIVE</span>
                        <div className="text-xl md:text-2xl text-gray-500 tracking-[0.3em] font-medium mt-4">by SWANYTHREE EnTech</div>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-2xl text-gray-400 mt-6 mb-14 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        The next generation of live streaming.<br />
                        <span className="text-white font-bold">Zero latency. 90% creator revenue. AI-driven production.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/discover" className="btn-primary flex items-center gap-3 text-lg px-10 py-5 rounded-2xl shadow-[0_0_60px_rgba(255,59,48,0.3)]">
                            <Play fill="white" size={22} />
                            START WATCHING
                        </Link>
                        <Link to="/studio" className="glass-morphism px-10 py-5 flex items-center gap-3 text-lg hover:bg-white/10 transition-all font-bold rounded-2xl group">
                            <Zap className="text-orange-500 group-hover:rotate-12 transition-transform" size={22} />
                            GO LIVE NOW
                            <ArrowRight size={16} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Bar */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-10 border-y border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl"
            >
                <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem value="20" suffix="ms" label="Xeron Latency" />
                    <StatItem value="90" suffix="%" label="Creator Revenue" />
                    <StatItem value="9" suffix="+" label="Simultaneous Platforms" />
                    <StatItem value="24" suffix="/7" label="AI Director Uptime" />
                </div>
            </motion.section>

            {/* Trending Previews */}
            <section className="relative z-10 py-24 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-black brand tracking-tighter uppercase italic">Trending <span className="text-red-600">Now</span></h2>
                            <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Real-time live previews from SeeWhy creators</p>
                        </div>
                        <Link to="/discover" className="text-xs font-black text-red-600 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2 group">
                            Explore All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide no-scrollbar -mx-6 px-6">
                        <LivePreviewCard stream={{ id: '1', title: 'Late Night Production Studio — 9 Guest Grid', username: 'AlexLivo', viewCount: 12400 }} />
                        <LivePreviewCard stream={{ id: '2', title: 'Why 20 Xeron Latency Changes Everything', username: 'TechWiz', viewCount: 45200 }} />
                        <LivePreviewCard stream={{ id: '3', title: 'Elite 9-Guest Lobby Battle Royale', username: 'SeeWhyGamer', viewCount: 1245000 }} />
                        <LivePreviewCard stream={{ id: '4', title: 'Producer Breakdown: Multi-Platform RTMP', username: 'StreamPro', viewCount: 8900 }} />
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-black brand tracking-tighter">
                        Built for <span className="text-red-600">Creators</span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-lg mx-auto font-medium">
                        Every feature designed to maximize your reach, revenue, and production quality.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Radio className="text-red-500" size={28} />}
                        title="Multi-Platform Streaming"
                        desc="Stream to YouTube, Twitch, TikTok, Kick, Facebook, LinkedIn, Instagram, X, and custom RTMP — all at once."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<Cpu className="text-orange-500" size={28} />}
                        title="K2 AI Swarm Director"
                        desc="AI agents that auto-switch scenes, moderate chat, extract highlights, and run TTS alerts in real-time."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Users className="text-blue-500" size={28} />}
                        title="9+ Guest Grid"
                        desc="Expandable video grid supporting up to 9 simultaneous guests with individual director controls."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<DollarSign className="text-green-500" size={28} />}
                        title="90/10 Revenue Split"
                        desc="Industry-leading 90% creator revenue with instant payouts via CashApp, PayPal, and Venmo."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={<Shield className="text-purple-500" size={28} />}
                        title="Private & Secure"
                        desc="End-to-end encryption, private access codes, and AI-powered content safety moderation."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Sparkles className="text-yellow-500" size={28} />}
                        title="Auto AI Clipping"
                        desc="K2 Swarm automatically detects viral moments and generates shareable vertical clips for social."
                        delay={0.5}
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-white/5 rounded-[3rem] p-16 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
                    <div className="relative z-10">
                        <Globe className="text-red-600 mx-auto mb-6" size={48} />
                        <h2 className="text-4xl md:text-5xl font-black brand tracking-tighter mb-4">
                            Ready to <span className="text-red-600">Go Live</span>?
                        </h2>
                        <p className="text-gray-400 max-w-lg mx-auto mb-10 font-medium">
                            Join thousands of creators already streaming on the most advanced platform ever built.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="btn-primary text-lg px-10 py-5 rounded-2xl shadow-[0_0_60px_rgba(255,59,48,0.3)]">
                                CREATE FREE ACCOUNT
                            </Link>
                            <Link to="/discover" className="glass-morphism px-10 py-5 text-lg hover:bg-white/10 transition-all font-bold rounded-2xl flex items-center gap-2">
                                <Heart size={18} className="text-red-500" />
                                BROWSE STREAMS
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="text-red-600 text-lg font-black brand">SeeWhy LIVE</span>
                        <span className="text-gray-800">|</span>
                        <span>by SWANYTHREE EnTech</span>
                    </div>
                    <div className="flex gap-8">
                        <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Creators</span>
                        <span className="hover:text-white transition-colors cursor-pointer">API</span>
                    </div>
                    <p>© 2026 SWANYTHREE EnTech</p>
                </div>
            </footer>
        </div>
    );
};

const StatItem = ({ value, suffix, label }: any) => (
    <div className="text-center">
        <p className="text-3xl md:text-4xl font-black brand">
            {value}<span className="text-red-600">{suffix}</span>
        </p>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="glass-morphism p-8 hover:bg-white/[0.04] transition-all group cursor-default"
    >
        <div className="mb-4 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 group-hover:text-red-600 transition-colors">{title}</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
    </motion.div>
);

export default Home;
