'use client';

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/Layout';
import Link from 'next/link';
import { useCountdown } from '@/hooks/useCountdown';
import { apiClient } from '@/services/apiClient';

export default function Home() {
    const [settings, setSettings] = useState<any>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const countdown = useCountdown(settings?.voting_start, settings?.voting_end);

    const handleMouseMove = (e: React.MouseEvent) => {
        // Calculate offset from center of screen (-25 to 25)
        const x = (e.clientX / window.innerWidth - 0.5) * 50;
        const y = (e.clientY / window.innerHeight - 0.5) * 50;
        setMousePosition({ x, y });
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await apiClient.getSettings();
            setSettings(response.data.data);
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    return (
        <PublicLayout showFooter={false}>
            {/* Hero Section */}
            <section 
                className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-20"
                onMouseMove={handleMouseMove}
            >
                {/* Decorative background glows */}
                <div 
                    className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
                    style={{ transform: `translate(calc(-50% + ${mousePosition.x * 2}px), calc(-50% + ${mousePosition.y * 2}px))` }}
                ></div>
                <div 
                    className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 ease-out"
                    style={{ transform: `translate(${mousePosition.x * -3}px, ${mousePosition.y * -3}px)` }}
                ></div>
                
                <div className="container-max text-center z-10 animate-fadeIn flex flex-col items-center">
                    
                    {/* Proud Sponsor Block */}
                    <div className="mb-4 sm:mb-6 animate-slideIn flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                        <p className="text-white/60 tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[8px] sm:text-[10px] font-semibold mb-2">Proudly Sponsored By</p>
                        <div className="flex flex-col items-center">
                            <div className="text-xl sm:text-2xl font-bold font-playfair tracking-widest text-gold drop-shadow-[0_0_15px_rgba(230,198,135,0.5)] leading-none text-center px-4">
                                Connecting Scripts
                            </div>
                            <p className="text-gold/70 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[7px] sm:text-[8px] font-medium mt-2">Digital Marketing Agency</p>
                        </div>
                    </div>

                    <p className="text-gold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-2 animate-slideIn" style={{ animationDelay: '0.1s' }}>The Annual Excellence Awards</p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 lg:mb-3 font-playfair text-glow text-white leading-tight px-4">
                        {settings?.event_name || 'Creators Awards'}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-light mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto font-light px-4">
                        {settings?.event_description || 'Celebrate and honor the most exceptional creators shaping our digital future.'}
                    </p>

                    {/* Countdown */}
                    {settings?.voting_end && countdown.phase !== 'ENDED' && (
                        <div className="mb-6 sm:mb-8 flex flex-col items-center gap-3 sm:gap-4">
                            <p className="text-gold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold">
                                {countdown.phase === 'BEFORE_START' ? 'Voting starts in' : 'Voting ends in'}
                            </p>
                            <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2">
                            <div className="glass-panel rounded-xl sm:rounded-2xl w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-1">{countdown.days}</div>
                                <p className="text-gold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest">Days</p>
                            </div>
                            <div className="glass-panel rounded-xl sm:rounded-2xl w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-1">{countdown.hours}</div>
                                <p className="text-gold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest">Hours</p>
                            </div>
                            <div className="glass-panel rounded-xl sm:rounded-2xl w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-1">{countdown.minutes}</div>
                                <p className="text-gold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest">Mins</p>
                            </div>
                            <div className="glass-panel rounded-xl sm:rounded-2xl w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-1">{countdown.seconds}</div>
                                <p className="text-gold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest">Secs</p>
                            </div>
                        </div>
                        </div>
                    )}

                    {countdown.phase === 'ENDED' && (
                        <div className="mb-8 p-6 glass-panel border border-red-500/50 rounded-2xl max-w-sm mx-auto">
                            <p className="text-red-400 text-lg font-semibold tracking-widest uppercase">Voting has ended</p>
                        </div>
                    )}

                    <div className="flex justify-center items-center px-4">
                        <Link 
                            href="/vote"
                            className="relative group px-8 py-3 sm:px-12 sm:py-4 bg-black/40 backdrop-blur-md overflow-hidden rounded-full border border-gold/30 hover:border-gold/80 hover:shadow-[0_0_40px_rgba(230,198,135,0.2)] transition-all duration-500 mt-2 sm:mt-4 inline-block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                            <span className="relative text-gold font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm group-hover:text-white transition-colors duration-300 flex items-center gap-2 sm:gap-3">
                                {countdown.phase === 'BEFORE_START' ? 'See Nominees' : 'Start Voting'}
                                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                                    →
                                </span>
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}
