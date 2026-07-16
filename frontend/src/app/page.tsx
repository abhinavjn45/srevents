'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PublicLayout } from '@/components/layout/Layout';
import { CategoryCard, CreatorCard } from '@/components/cards/Cards';
import { Button } from '@/components/ui/Base';
import { useCountdown } from '@/hooks/useCountdown';
import { apiClient } from '@/services/apiClient';
import { generateBrowserFingerprint, getCookieToken, getLocalStorageToken } from '@/utils/fingerprint';
import { showToast } from '@/utils/toast';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

export default function Home() {
    const [settings, setSettings] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [creators, setCreators] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const turnstileRef = useRef<TurnstileInstance>(null);

    const countdown = useCountdown(settings?.votingEnd);

    useEffect(() => {
        loadSettings();
        loadCategories();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await apiClient.getSettings();
            setSettings(response.data.data);
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await apiClient.getCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleCategorySelect = async (categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        setSelectedCategory(category);

        try {
            const response = await apiClient.getCreators(categoryId);
            setCreators(response.data.data);
        } catch (error) {
            console.error('Failed to load creators', error);
        }
    };

    const handleVote = async (categoryId: number, creatorId: number) => {
        if (!turnstileToken) {
            showToast('Please wait for anti-bot verification to complete', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.submitVote({
                categoryId,
                creatorId,
                browserFingerprint: generateBrowserFingerprint(),
                cookieToken: getCookieToken(),
                localStorageToken: getLocalStorageToken(),
                turnstileToken: turnstileToken
            });

            showToast('Vote submitted successfully!', 'success');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to submit vote';
            showToast(message, 'error');
        } finally {
            setIsLoading(false);
            // Always reset turnstile after a vote (successful or failed) so the user gets a fresh token for the next vote
            turnstileRef.current?.reset();
        }
    };

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary-bg to-primary-bg overflow-hidden">
                <div className="container-max text-center z-10">
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 font-playfair">
                        {settings?.eventName || 'Creators Awards'}
                    </h1>
                    <p className="text-xl text-text-light mb-12 max-w-2xl mx-auto">
                        {settings?.eventDescription || 'Vote for your favorite creators across multiple categories'}
                    </p>

                    {/* Countdown */}
                    {settings?.votingEnd && !countdown.isEnded && (
                        <div className="mb-12 flex justify-center gap-8">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gold">{countdown.days}</div>
                                <p className="text-text-medium text-sm mt-2">Days</p>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gold">{countdown.hours}</div>
                                <p className="text-text-medium text-sm mt-2">Hours</p>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gold">{countdown.minutes}</div>
                                <p className="text-text-medium text-sm mt-2">Minutes</p>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-gold">{countdown.seconds}</div>
                                <p className="text-text-medium text-sm mt-2">Seconds</p>
                            </div>
                        </div>
                    )}

                    {countdown.isEnded && (
                        <div className="mb-12 p-6 bg-card-bg border border-red-500 rounded-20">
                            <p className="text-red-500 text-lg font-semibold">Voting has ended</p>
                        </div>
                    )}

                    <Button variant="primary" size="lg" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                        Start Voting
                    </Button>

                    <div className="mt-8 flex justify-center">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                            onSuccess={(token) => setTurnstileToken(token)}
                            options={{ theme: 'dark' }}
                        />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container-max py-20">
                <h2 className="text-4xl font-bold mb-12 text-center">Award Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(category => (
                        <CategoryCard
                            key={category.id}
                            id={category.id}
                            title={category.title}
                            image={category.image}
                            creatorCount={category.creator_count || 0}
                            votingEnd={category.voting_end}
                            onVote={handleCategorySelect}
                        />
                    ))}
                </div>
            </section>

            {/* Creators */}
            {selectedCategory && (
                <section className="container-max py-20">
                    <h2 className="text-4xl font-bold mb-12 capitalize">Nominees - {selectedCategory.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {creators.map(creator => (
                            <CreatorCard
                                key={creator.id}
                                id={creator.id}
                                name={creator.creator_name}
                                category={selectedCategory.title}
                                image={creator.profile_image}
                                bio={creator.short_bio}
                                instagram={creator.instagram_url}
                                youtube={creator.youtube_url}
                                categoryId={selectedCategory.id}
                                onVote={handleVote}
                            />
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
