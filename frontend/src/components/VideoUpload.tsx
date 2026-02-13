import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertTriangle, Play, Film as FileVideo, Clock } from 'lucide-react';

const VideoUpload: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [status, setStatus] = useState<'idle' | 'validating' | 'error' | 'ready'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            validateVideo(selectedFile);
        }
    };

    const validateVideo = (videoFile: File) => {
        setStatus('validating');
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            const videoDuration = video.duration;
            setDuration(videoDuration);

            if (videoDuration > 600) { // 10 minute limit
                setStatus('error');
            } else {
                setStatus('ready');
            }
        };
        video.src = URL.createObjectURL(videoFile);
    };

    const startUpload = () => {
        // Mock upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Post <span className="text-red-600">Video</span></h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">10 MINUTE PRODUCTION LIMIT</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X /></button>
                            </div>

                            {!file ? (
                                <label className="flex flex-col items-center justify-center h-80 w-full border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all hover:border-red-600/50 group">
                                    <div className="p-6 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                        <Upload size={40} className="text-gray-500 group-hover:text-red-600" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest">Select Production Media</p>
                                    <p className="text-[10px] text-gray-600 mt-2 uppercase">MP4, MOV up to 1GB</p>
                                    <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
                                            <FileVideo size={32} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-sm truncate">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 uppercase font-black">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button onClick={() => setFile(null)} className="text-gray-600 hover:text-white transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <ValidationCard
                                            icon={<Clock size={20} />}
                                            label="Duration"
                                            value={duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : '--'}
                                            status={status === 'error' ? 'fail' : status === 'ready' ? 'pass' : 'loading'}
                                        />
                                        <ValidationCard
                                            icon={<CheckCircle size={20} />}
                                            label="Status"
                                            value={status === 'error' ? 'LIMIT EXCEEDED' : status === 'ready' ? 'READY TO CLIP' : 'ANALYZING...'}
                                            status={status === 'error' ? 'fail' : status === 'ready' ? 'pass' : 'loading'}
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-2xl flex gap-4 items-center">
                                            <AlertTriangle className="text-red-600 flex-shrink-0" />
                                            <p className="text-xs text-red-500 font-bold uppercase tracking-tight">Your video exceeds the 10-minute production limit. Please trim and re-upload.</p>
                                        </div>
                                    )}

                                    {status === 'ready' && (
                                        <div className="space-y-6">
                                            {uploadProgress > 0 && (
                                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} className="h-full bg-red-600" />
                                                </div>
                                            )}
                                            <button
                                                onClick={startUpload}
                                                className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_40px_rgba(255,59,48,0.3)]"
                                            >
                                                {uploadProgress === 100 ? 'VIDEO POSTED' : uploadProgress > 0 ? `UPLOADING ${uploadProgress}%` : 'POST VIDEO NOW'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const ValidationCard = ({ icon, label, value, status }: any) => (
    <div className="bg-black border border-white/5 p-5 rounded-2xl flex items-center gap-4">
        <div className={`${status === 'pass' ? 'text-green-500' : status === 'fail' ? 'text-red-500' : 'text-gray-600 animate-spin'}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className={`text-sm font-black uppercase ${status === 'fail' ? 'text-red-500' : 'text-white'}`}>{value}</p>
        </div>
    </div>
);

export default VideoUpload;
