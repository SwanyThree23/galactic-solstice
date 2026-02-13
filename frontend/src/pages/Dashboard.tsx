import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Video, ShieldCheck, Wallet, ArrowUpRight, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 bg-[#050505] min-h-screen text-white">
            <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={16} className="text-red-600" />
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Verified Creator Console</span>
                    </div>
                    <h2 className="text-5xl font-black brand uppercase tracking-tighter italic">Earnings <span className="text-red-600">Hub</span></h2>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white text-black">Insights</button>
                    <button className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Withdraw</button>
                </div>
            </header>

            {/* Main Wallet Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-morphism p-10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet size={200} />
                    </div>

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">Available Balance</span>
                            <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black border border-green-500/20">
                                <TrendingUp size={12} />
                                +14.2% THIS WEEK
                            </div>
                        </div>

                        <h3 className="text-7xl font-black tracking-tighter">$2,405.<span className="text-gray-500 text-5xl">75</span></h3>

                        <div className="flex gap-4 pt-4">
                            <button className="btn-primary px-10 py-4 flex items-center gap-3">
                                <Zap size={20} fill="white" />
                                INSTANT CASHOUT
                            </button>
                            <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-4 rounded-xl text-xs font-black uppercase transition-all">
                                View Breakdown
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-4">
                    <StatCard title="90% Split Net" value="$2,165.17" detail="After platform & processing" highlight />
                    <StatCard title="Active Viewers" value="8,241" detail="Global distribution" />
                    <StatCard title="Paywall Users" value="284" detail="Access code redemptions" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="glass-morphism p-8 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-red-600">Recent Transactions</h3>
                    <div className="space-y-4">
                        <TransactionItem user="AlexStreamer" amount="+$21.25" total="$25.00" method="CashApp" status="Verified" />
                        <TransactionItem user="EliteViewer" amount="+$8.50" total="$10.00" method="PayPal" status="Verified" />
                        <TransactionItem user="CY_Supporter" amount="+$85.00" total="$100.00" method="Zelle" status="System Flag" warning />
                        <TransactionItem user="LiveLover" amount="+$4.25" total="$5.00" method="Venmo" status="Verified" />
                    </div>
                </section>

                <section className="glass-morphism p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-red-600 mb-2">
                        <ArrowUpRight size={32} />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Growth Projection</h4>
                    <p className="text-gray-500 text-sm max-w-xs font-medium">Based on current retention of 20 xeron latency, you're on track for $10K monthly revenue.</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5 }} className="h-full bg-red-600 shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, detail, highlight = false }: any) => (
    <div className={`glass-morphism p-6 flex flex-col justify-between border-l-4 ${highlight ? 'border-red-600' : 'border-white/5'}`}>
        <div>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</h4>
            <p className={`text-2xl font-black ${highlight ? 'text-white' : 'text-gray-300'}`}>{value}</p>
        </div>
        <p className="text-[9px] font-medium text-gray-600 uppercase mt-2">{detail}</p>
    </div>
);

const TransactionItem = ({ user, amount, total, method, status, warning = false }: any) => (
    <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-xs font-bold border border-white/5">{user[0]}</div>
            <div>
                <p className="text-xs font-black">{user}</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-tighter">{method} • {status}</p>
            </div>
        </div>
        <div className="text-right">
            <p className={`text-sm font-black ${warning ? 'text-orange-500' : 'text-green-500'}`}>{amount}</p>
            <p className="text-[9px] text-gray-600 uppercase tracking-tighter">Gross: {total}</p>
        </div>
    </div>
);

export default Dashboard;
