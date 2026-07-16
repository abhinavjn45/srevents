'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PublicLayout } from '@/components/layout/Layout';
import { CreatorCard } from '@/components/cards/Cards';
import { apiClient } from '@/services/apiClient';
import { generateBrowserFingerprint, getCookieToken, getLocalStorageToken } from '@/utils/fingerprint';
import { showToast } from '@/utils/toast';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useCountdown } from '@/hooks/useCountdown';

export default function VotePage() {
    const [settings, setSettings] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [creators, setCreators] = useState<any[]>([]);
    
    const [isVoting, setIsVoting] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [votingCreatorId, setVotingCreatorId] = useState<number | null>(null);
    const [votedCategories, setVotedCategories] = useState<Record<number, number>>({});
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const turnstileRef = useRef<TurnstileInstance>(null);

    const countdown = useCountdown(settings?.voting_start, settings?.voting_end);
    const isVotingOpen = settings?.global_voting_enabled === 1 && countdown.phase === 'ACTIVE';

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const loadData = async () => {
        try {
            const [settingsRes, categoriesRes, creatorsRes, votesRes] = await Promise.all([
                apiClient.getSettings(),
                apiClient.getCategories(),
                apiClient.getCreators(),
                apiClient.getMyVotes({
                    browserFingerprint: generateBrowserFingerprint(),
                    cookieToken: getCookieToken(),
                    localStorageToken: getLocalStorageToken()
                })
            ]);
            setSettings(settingsRes.data.data);
            setCategories(categoriesRes.data.data);
            setCreators(creatorsRes.data.data);
            
            // Sync DB votes with local storage
            const dbVotes = votesRes.data.data;
            setVotedCategories(dbVotes);
            localStorage.setItem('sr_voted_categories', JSON.stringify(dbVotes));
            
        } catch (error) {
            console.error('Failed to load data', error);
            showToast('Failed to load voting data', 'error');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleVote = async (categoryId: number, creatorId: number) => {
        if (!isVotingOpen) {
            showToast('Voting is currently closed', 'error');
            return;
        }

        if (cooldown > 0) {
            return;
        }

        if (!turnstileToken) {
            showToast('Please wait for anti-bot verification to complete', 'error');
            return;
        }

        setIsVoting(true);
        setVotingCreatorId(creatorId);

        try {
            await apiClient.submitVote({
                categoryId,
                creatorId,
                browserFingerprint: generateBrowserFingerprint(),
                cookieToken: getCookieToken(),
                localStorageToken: getLocalStorageToken(),
                turnstileToken: turnstileToken
            });

            showToast('Vote submitted successfully!', 'success');
            // Lock the category and record the voted creator
            const newVoted = { ...votedCategories, [categoryId]: creatorId };
            setVotedCategories(newVoted);
            localStorage.setItem('sr_voted_categories', JSON.stringify(newVoted));
            
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to submit vote';
            showToast(message, 'error');
        } finally {
            setIsVoting(false);
            setVotingCreatorId(null);
            setTurnstileToken(''); // Clear token immediately to prevent reuse
            setCooldown(5); // Start the 5-second cooldown
            turnstileRef.current?.reset();
        }
    };

    return (
        <PublicLayout>
            <div className="pt-24 sm:pt-32 pb-8 sm:pb-12 container-max px-4 sm:px-6">
                <div className="text-center mb-10 sm:mb-16 animate-fadeIn">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-playfair text-white text-glow mb-4">
                        Cast Your Votes
                    </h1>
                    
                    {!isVotingOpen && settings && (
                        <div className="inline-block mt-2 sm:mt-4 px-4 py-2 sm:px-6 sm:py-3 glass-panel border border-red-500/50 rounded-full">
                            <p className="text-red-400 font-semibold tracking-widest uppercase text-xs sm:text-sm">
                                {countdown.phase === 'BEFORE_START' ? 'Voting has not started yet' : 'Voting is closed'}
                            </p>
                        </div>
                    )}
                    
                    <div className="mt-8 flex justify-center">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                            onSuccess={(token) => setTurnstileToken(token)}
                            options={{ theme: 'dark' }}
                        />
                    </div>
                </div>

                <div className="space-y-16 sm:space-y-24">
                    {categories.map(category => {
                        const categoryCreators = creators.filter(c => c.category_id === category.id);
                        if (categoryCreators.length === 0) return null;
                        
                        const votedCreatorId = votedCategories[category.id];
                        const hasVoted = votedCreatorId !== undefined;

                        return (
                            <section key={category.id} className="relative z-10">
                                <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-3 sm:gap-0">
                                    <div>
                                        <p className="text-gold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2">Category</p>
                                        <h2 className="text-3xl sm:text-4xl font-bold font-playfair text-white capitalize">{category.title}</h2>
                                    </div>
                                    {hasVoted && (
                                        <span className="text-green-400 text-xs sm:text-sm font-semibold tracking-widest uppercase bg-green-500/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-green-500/20 whitespace-nowrap">
                                            Voted ✓
                                        </span>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                                    {categoryCreators.map(creator => {
                                        const isVotedForThisCreator = votedCreatorId === creator.id;
                                        const buttonText = isLoadingData 
                                            ? 'Loading...' 
                                            : !isVotingOpen 
                                                ? 'Closed' 
                                                : hasVoted 
                                                    ? (isVotedForThisCreator ? 'Voted ✓' : 'Locked') 
                                                    : cooldown > 0
                                                        ? `Wait ${cooldown}s`
                                                        : 'Vote';
                                                
                                        return (
                                            <CreatorCard
                                                key={creator.id}
                                                id={creator.id}
                                                name={creator.creator_name}
                                                category={category.title}
                                                image={creator.profile_image}
                                                bio={creator.short_bio}
                                                instagram={creator.instagram_url}
                                                youtube={creator.youtube_url}
                                                categoryId={category.id}
                                                onVote={handleVote}
                                                isVoting={isVoting || hasVoted || !isVotingOpen || isLoadingData || cooldown > 0}
                                                isCurrentCreatorVoting={votingCreatorId === creator.id}
                                                buttonText={buttonText}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </PublicLayout>
    );
}
