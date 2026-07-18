'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/services/apiClient';
import { Trophy, Crown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreatorRank {
    id: number;
    creator_name: string;
    category: string;
    count?: number;
    vote_count?: number;
    rank: number;
}

// Helper for Proper Case formatting
const toProperCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export default function LiveResultsPage() {
    const [categories, setCategories] = useState<{ category: string, winner: CreatorRank, runnersUp: CreatorRank[] }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const loadData = async () => {
        try {
            const res = await apiClient.getLiveLeaderboard();
            const data: CreatorRank[] = res.data.data;
            
            const grouped = data.reduce((acc, curr) => {
                if (!acc[curr.category]) acc[curr.category] = [];
                acc[curr.category].push(curr);
                return acc;
            }, {} as Record<string, CreatorRank[]>);
            
            const processed = Object.entries(grouped).map(([category, creators]) => {
                // Apply toProperCase to creator names as well
                const formattedCreators = creators.map(c => ({
                    ...c,
                    creator_name: toProperCase(c.creator_name)
                }));
                return {
                    category: toProperCase(category),
                    winner: formattedCreators[0],
                    runnersUp: formattedCreators.slice(1, 3)
                };
            });
            
            setCategories(processed);
        } catch (error) {
            console.error('Failed to fetch live results:', error);
        }
    };

    useEffect(() => {
        loadData();
        const refreshTimer = setInterval(loadData, 30000);
        return () => clearInterval(refreshTimer);
    }, []);

    useEffect(() => {
        if (categories.length === 0) return;
        
        const slideTimer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % categories.length);
        }, 8000);
        
        return () => clearInterval(slideTimer);
    }, [categories.length]);

    // Fireworks / Skyshots effect when slide changes
    useEffect(() => {
        if (categories.length === 0) return;

        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            // Left skyshot
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 1 },
                colors: ['#FFD700', '#ffffff', '#B8860B'],
                zIndex: 9999
            });
            // Right skyshot
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 1 },
                colors: ['#FFD700', '#ffffff', '#B8860B'],
                zIndex: 9999
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        
        // Slight delay so it shoots when the card actually animates in
        const timeout = setTimeout(() => {
            frame();
        }, 500);

        return () => clearTimeout(timeout);
    }, [currentIndex, categories.length]);

    if (categories.length === 0) {
        return (
            <div className="h-screen w-screen bg-[#030303] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="text-gold animate-pulse text-sm font-playfair tracking-[0.4em] uppercase z-10">Initializing Ceremony...</div>
            </div>
        );
    }

    const currentSlide = categories[currentIndex];

    const backgroundStyle = {
        background: 'radial-gradient(ellipse at center, #111111 0%, #030303 100%)',
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden relative" style={backgroundStyle}>
            {/* Ambient Background Particles/Rays */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] bg-gold/5 rounded-full blur-[100px] animate-pulse mix-blend-screen"></div>
                
                {/* Animated CSS Spotlights */}
                <motion.div 
                    animate={{ rotate: [-20, -40, -20] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute -bottom-32 -left-[10%] w-[20vw] h-[150vh] bg-gradient-to-t from-gold/15 via-gold/5 to-transparent blur-[60px] origin-bottom mix-blend-screen pointer-events-none" 
                />
                <motion.div 
                    animate={{ rotate: [20, 40, 20] }}
                    transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
                    className="absolute -bottom-32 -right-[10%] w-[20vw] h-[150vh] bg-gradient-to-t from-gold/15 via-gold/5 to-transparent blur-[60px] origin-bottom mix-blend-screen pointer-events-none" 
                />
                <motion.div 
                    animate={{ rotate: [0, -15, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                    className="absolute -bottom-40 left-[40%] w-[20vw] h-[150vh] bg-gradient-to-t from-white/10 to-transparent blur-[80px] origin-bottom mix-blend-screen pointer-events-none" 
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} 
                    className="z-10 w-full h-full flex flex-col items-center justify-center px-4 relative"
                >
                    {/* Category Title Section */}
                    <div className="flex flex-col items-center mb-8 sm:mb-10 w-full max-w-4xl text-center">
                        <div className="flex items-center gap-3 text-gold/60 tracking-[0.4em] uppercase text-[10px] sm:text-xs font-semibold mb-3">
                            <div className="h-[1px] w-8 sm:w-12 bg-gold/30"></div>
                            <Sparkles size={12} className="text-gold/80" /> 
                            <span>Award Category</span> 
                            <Sparkles size={12} className="text-gold/80" />
                            <div className="h-[1px] w-8 sm:w-12 bg-gold/30"></div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-playfair text-white tracking-wide drop-shadow-md capitalize">
                            {currentSlide.category?.toLowerCase()}
                        </h1>
                    </div>

                    {/* Winner Card Container */}
                    <div className="relative w-full max-w-2xl flex flex-col items-center justify-center">
                        <motion.div 
                            className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-8 sm:p-12 rounded-2xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                            
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="mb-6"
                            >
                                <div className="bg-gradient-to-b from-[#1f1a0e] to-[#0a0a0a] border border-gold/20 p-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                                    <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full"></div>
                                    <Crown size={40} strokeWidth={1.5} className="text-gold relative z-10" />
                                </div>
                            </motion.div>
                            
                            <h3 className="text-gold/70 tracking-[0.3em] uppercase text-[10px] font-bold mb-3 relative z-10">The Winner Is</h3>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-8 font-playfair leading-[1.2] break-words whitespace-normal w-full px-2 capitalize"
                            >
                                {currentSlide.winner?.creator_name?.toLowerCase() || 'TBD'}
                            </motion.h2>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gold/15 bg-black/40 shadow-inner"
                            >
                                <Trophy className="text-gold/80" size={18} strokeWidth={1.5} />
                                <span className="text-xl sm:text-2xl font-light tracking-wide text-gold drop-shadow-md">
                                    {(currentSlide.winner?.count || currentSlide.winner?.vote_count || 0).toLocaleString()}
                                </span>
                                <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium ml-1 mt-1">Votes</span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Runners Up Container */}
                    {currentSlide.runnersUp.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="mt-8 flex gap-4 sm:gap-8 justify-center w-full max-w-4xl"
                        >
                            {currentSlide.runnersUp.map((runner, idx) => (
                                <div key={runner.id} className="flex-1 max-w-[280px] bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5 flex flex-col items-center text-center backdrop-blur-sm">
                                    <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase mb-1.5 font-semibold">
                                        {idx === 0 ? 'Runner Up' : '3rd Place'}
                                    </span>
                                    <span className="text-white/80 font-playfair text-lg sm:text-xl break-words w-full leading-tight mb-2 capitalize">
                                        {runner.creator_name?.toLowerCase()}
                                    </span>
                                    <span className="text-gold/50 text-[10px] sm:text-xs tracking-wider font-light">
                                        {(runner.count || runner.vote_count || 0).toLocaleString()} Votes
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Premium Minimal Progress Indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-20 px-4">
                {categories.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-[2px] sm:h-1 rounded-full transition-all duration-700 ease-out ${idx === currentIndex ? 'w-8 sm:w-12 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'w-3 sm:w-4 bg-white/10'}`}
                    />
                ))}
            </div>
        </div>
    );
}
