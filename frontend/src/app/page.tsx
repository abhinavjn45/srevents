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

                    {/* Event Results Notice */}
                    <div className="mb-6 sm:mb-8 p-6 sm:p-8 glass-panel border border-gold/30 rounded-2xl max-w-lg mx-auto backdrop-blur-md bg-black/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] transform hover:scale-105 transition-transform duration-500">
                        <p className="text-gold text-base sm:text-xl font-semibold tracking-[0.15em] uppercase text-center leading-relaxed drop-shadow-md">
                            Results will be Announced<br/>today at the Event
                        </p>
                    </div>


                </div>
            </section>

        </PublicLayout>
    );
}
