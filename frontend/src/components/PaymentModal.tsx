import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Zap, CheckCircle, CreditCard, X } from 'lucide-react';

const PaymentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedAmount, setSelectedAmount] = useState(10);

    const amounts = [1, 5, 10, 50, 100, 500];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,59,48,0.2)]"
                    >
                        <div className="p-10">
                            {step === 1 ? (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase tracking-tight italic">Direct Support</h3>
                                            <p className="text-gray-500 font-medium">90% of your contribution goes directly to the creator.</p>
                                        </div>
                                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X /></button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {amounts.map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setSelectedAmount(amt)}
                                                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${selectedAmount === amt ? 'bg-red-600 border-red-500 shadow-lg shadow-red-600/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                            >
                                                <span className="text-2xl font-black">${amt}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">INSTANT SETTLEMENT VIA</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <ProviderButton img="https://cdn.iconscout.com/icon/free/png-256/free-paypal-5-569202.png" label="PayPal" />
                                            <ProviderButton img="https://static-00.iconduck.com/assets.00/cash-app-icon-2048x2048-r648tvev.png" label="CashApp" />
                                            <ProviderButton img="https://seeklogo.com/images/V/venmo-logo-E31FD19C83-seeklogo.com.png" label="Venmo" />
                                            <ProviderButton img="https://www.zellepay.com/sites/default/files/2019-11/zell-logo-purple.png" label="Zelle" />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Zap size={24} fill="black" />
                                        SEND ${selectedAmount} NOW
                                    </button>
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 text-center space-y-6">
                                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                                        <CheckCircle size={48} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black italic">TRANSACTION SENT!</h3>
                                        <p className="text-gray-500 mt-2">The creator has been notified in real-time.</p>
                                    </div>
                                    <button onClick={onClose} className="btn-primary w-full py-4 mt-8">CONTINUE WATCHING</button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const ProviderButton = ({ img, label }: any) => (
    <button className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all">
        <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden">
            <img src={img} alt={label} className="w-full h-full object-contain" />
        </div>
        <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
    </button>
);

export default PaymentModal;
