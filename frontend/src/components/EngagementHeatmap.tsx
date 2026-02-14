import React from 'react';
import { motion } from 'framer-motion';

const EngagementHeatmap: React.FC = () => {
    // Simulated engagement data (percent retention over time)
    const data = [80, 85, 90, 88, 70, 65, 80, 95, 100, 92, 85, 80, 75, 78, 82];

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4">
            <div className="flex justify-between items-end h-24 gap-1">
                {data.map((val, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className={`flex-grow rounded-t-sm ${val > 80 ? 'bg-red-600' : val > 70 ? 'bg-orange-600' : 'bg-gray-700'}`}
                        style={{ minWidth: '4px' }}
                    />
                ))}
            </div>
            <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                <span>-15m</span>
                <span>-10m</span>
                <span>-5m</span>
                <span>NOW</span>
            </div>
            <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400">Peak Engagement</span>
                    <span className="text-[10px] font-black text-red-500">92% @ 15:12</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400">Avg. Retention</span>
                    <span className="text-[10px] font-black text-white">82.4%</span>
                </div>
            </div>
        </div>
    );
};

export default EngagementHeatmap;
