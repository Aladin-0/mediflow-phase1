'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        useAuthStore.persist.rehydrate();
        useSettingsStore.persist.rehydrate();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
