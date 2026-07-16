'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';

interface CreatorRank {
    id: number;
    creator_name: string;
    category: string;
    count: number;
}

const CategoryCard = ({ category, creators, isMain }: { category: string, creators: CreatorRank[], isMain: boolean }) => (
    <div className={`glass-panel border flex flex-col min-h-0 ${isMain ? 'p-4 sm:p-5 h-full border-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.1)] transform scale-[1.02] rounded-3xl' : 'p-3 border-white/5 bg-white/[0.02] rounded-2xl'}`}>
        <h2 className={`${isMain ? 'text-2xl sm:text-3xl text-gold mb-3' : 'text-lg text-white mb-2'} font-bold font-playfair border-b border-white/10 pb-2 capitalize shrink-0 truncate text-center`}>
            {category}
        </h2>
        <div className={`space-y-1.5 flex-1 flex flex-col ${isMain ? 'overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold/30 [&::-webkit-scrollbar-thumb]:rounded-full' : 'overflow-hidden'}`}>
            {creators.map((creator, index) => (
                <div 
                    key={creator.id} 
                    className={`flex items-center justify-between border border-white/5 hover:border-gold/30 transition-colors ${
                        isMain 
                            ? `p-1.5 px-4 rounded-xl ${index === 0 ? 'bg-gold/10 border-gold/50' : 'bg-transparent'}` 
                            : `p-1 px-2 rounded-lg ${index === 0 ? 'bg-white/5' : 'bg-transparent'}`
                    }`}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`shrink-0 rounded-full flex items-center justify-center font-bold ${
                            isMain 
                                ? `w-6 h-6 text-xs ${index === 0 ? 'bg-gold text-black shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'bg-white/5 text-white'}` 
                                : `w-5 h-5 text-[10px] ${index === 0 ? 'bg-gold text-black shadow-[0_0_5px_rgba(255,215,0,0.5)]' : 'bg-white/5 text-white'}`
                        }`}>
                            {index + 1}
                        </div>
                        <span className={`${isMain ? 'text-base sm:text-lg font-semibold' : 'text-sm sm:text-base font-medium'} text-white/90 truncate`}>
                            {creator.creator_name}
                        </span>
                    </div>
                    <div className="text-gold font-bold text-base flex items-baseline gap-1 shrink-0 ml-2">
                        {creator.count} <span className="text-[9px] sm:text-[10px] font-normal text-white/40 uppercase tracking-widest">Votes</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function LiveLeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<Record<string, CreatorRank[]>>({});
    const [refreshCountdown, setRefreshCountdown] = useState(30);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadData = async () => {
        try {
            const res = await apiClient.getLiveLeaderboard();
            const data: CreatorRank[] = res.data.data;
            
            // Group by category
            const grouped = data.reduce((acc, curr) => {
                if (!acc[curr.category]) acc[curr.category] = [];
                acc[curr.category].push(curr);
                return acc;
            }, {} as Record<string, CreatorRank[]>);
            
            setLeaderboard(grouped);
            setLastUpdated(new Date());
            setRefreshCountdown(30);
        } catch (error) {
            console.error('Failed to fetch live leaderboard:', error);
        }
    };

    useEffect(() => {
        // Initial load
        loadData();

        // Refresh interval
        const timer = setInterval(() => {
            setRefreshCountdown(prev => {
                if (prev <= 1) {
                    loadData();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Split categories
    const entries = Object.entries(leaderboard);
    const mainCategoryIndex = entries.findIndex(([cat]) => cat.toLowerCase().includes('creator of the year'));
    let mainCategory = null;
    let otherCategories = entries;

    if (mainCategoryIndex !== -1) {
        mainCategory = entries[mainCategoryIndex];
        otherCategories = entries.filter((_, idx) => idx !== mainCategoryIndex);
    } else if (entries.length > 0) {
        // Fallback: pick the first one as main if "Creator of the year" is not found
        mainCategory = entries[0];
        otherCategories = entries.slice(1);
    }

    const half = Math.ceil(otherCategories.length / 2);
    const leftCategories = otherCategories.slice(0, half);
    const rightCategories = otherCategories.slice(half);

    return (
        <div className="h-screen overflow-hidden bg-deep-black text-white p-3 sm:p-4 relative flex flex-col selection:bg-gold/30">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 w-full max-w-[98vw] mx-auto flex-1 flex flex-col min-h-0">
                <div className="text-center mb-3 shrink-0 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl font-bold font-playfair text-gold text-glow mb-1">
                        Live Leaderboard
                    </h1>
                    {lastUpdated && (
                        <p className="text-white/50 text-xs sm:text-sm tracking-widest uppercase">
                            Last Updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                <div className="flex gap-6 w-full h-full overflow-hidden">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-4 min-h-0 z-10">
                        {leftCategories.map(([category, creators]) => (
                            <CategoryCard key={category} category={category} creators={creators} isMain={false} />
                        ))}
                    </div>

                    {/* Center Column (Highlighted) */}
                    <div className="flex-[1.5] flex flex-col justify-center gap-4 min-h-0 py-4 sm:py-8 z-20">
                        {mainCategory && (
                            <CategoryCard category={mainCategory[0]} creators={mainCategory[1]} isMain={true} />
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-4 min-h-0 z-10">
                        {rightCategories.map(([category, creators]) => (
                            <CategoryCard key={category} category={category} creators={creators} isMain={false} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Refresh Indicator */}
            <div className="fixed bottom-4 right-4 z-50">
                <div className="glass-panel px-4 py-2 rounded-full border border-gold/20 flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                    <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/80">
                        Refresh: {refreshCountdown}s
                    </span>
                </div>
            </div>
        </div>
    );
}
