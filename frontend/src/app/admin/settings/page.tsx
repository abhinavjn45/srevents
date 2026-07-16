'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/Layout';
import { Card, Button, Input } from '@/components/ui/Base';
import { apiClient } from '@/services/apiClient';
import { showToast } from '@/utils/toast';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.getSettings();
            setSettings(response.data.data);
        } catch (error) {
            showToast('Failed to load settings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await apiClient.updateSettings(settings);
            showToast('Settings saved successfully', 'success');
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Failed to save settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Settings</h1>

                <Card className="max-w-2xl">
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <Input
                            label="Event Name"
                            value={settings?.event_name || ''}
                            onChange={(e) => setSettings({ ...settings, event_name: e.target.value })}
                        />

                        <Input
                            label="Event Description"
                            placeholder="Describe your event..."
                            value={settings?.event_description || ''}
                            onChange={(e) => setSettings({ ...settings, event_description: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Voting Start"
                                type="datetime-local"
                                value={settings?.voting_start ? settings.voting_start.slice(0, 16) : ''}
                                onChange={(e) => setSettings({ ...settings, voting_start: e.target.value })}
                            />
                            <Input
                                label="Voting End"
                                type="datetime-local"
                                value={settings?.voting_end ? settings.voting_end.slice(0, 16) : ''}
                                onChange={(e) => setSettings({ ...settings, voting_end: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="votingEnabled"
                                checked={settings?.global_voting_enabled || false}
                                onChange={(e) => setSettings({ ...settings, global_voting_enabled: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="votingEnabled" className="text-white">
                                Enable Voting
                            </label>
                        </div>

                        <Input
                            label="Footer Text"
                            placeholder="Copyright and footer information..."
                            value={settings?.footer_text || ''}
                            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                        />

                        <Button type="submit" variant="primary" className="w-full" isLoading={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
