import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Zap, Shield, Heart } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10"
            >
                <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter brand">
                    YLIV<span className="text-red-600">4.0</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
                    The next generation of live streaming. Zero latency. 90% creator revenue. AI-driven production.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <Link to="/discover" className="btn-primary flex items-center gap-3 text-lg px-8 py-4">
                        <Play fill="white" size={24} />
                        START WATCHING
                    </Link>
                    <Link to="/studio" className="glass-morphism px-8 py-4 flex items-center gap-3 text-lg hover:bg-white/10 transition-all font-bold">
                        <Zap className="text-orange-500" size={24} />
                        GO LIVE NOW
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 z-10"
            >
                <Feature icon={<Zap className="text-red-500" />} label="20 Xeron Latency" />
                <Feature icon={<Shield className="text-green-500" />} label="Direct Payouts" />
                <Feature icon={<Heart className="text-pink-500" />} label="90% Split" />
                <Feature icon={<Play className="text-blue-500" />} label="Multi-Stream" />
            </motion.div>
        </div>
    );
};

const Feature = ({ icon, label }: any) => (
    <div className="flex flex-col items-center gap-2">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
    </div>
);

export default Home;
