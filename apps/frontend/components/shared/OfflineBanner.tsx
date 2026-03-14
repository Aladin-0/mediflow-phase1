'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { syncOfflineBills, getPendingBills } from '@/lib/offline-db';
import { salesApi } from '@/lib/apiClient';

export function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(true);
    const [showBanner, setShowBanner] = useState(false);
    const [syncMessage, setSyncMessage] = useState('Back online. Syncing...');

    useEffect(() => {
        // Initial check requires navigator
        if (typeof navigator !== 'undefined') {
            setIsOnline(navigator.onLine);
            if (!navigator.onLine) {
                setShowBanner(true);
            }
        }

        const handleOnline = async () => {
            setIsOnline(true);
            setShowBanner(true);
            setSyncMessage('Back online. Syncing offline bills...');

            try {
                const pending = await getPendingBills();
                if (pending.length > 0) {
                    const result = await syncOfflineBills(salesApi.create as never);
                    setSyncMessage(`Synced ${result.successCount} of ${result.totalAttempted} offline bills.`);
                } else {
                    setSyncMessage('Back online.');
                }
            } catch (err) {
                setSyncMessage('Back online, but sync failed. Will retry later.');
            }

            const timer = setTimeout(() => setShowBanner(false), 4000);
            return () => clearTimeout(timer);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner) return null;

    return (
        <div
            className={cn(
                'fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 px-4 text-sm text-center text-white transition-transform duration-300 ease-in-out',
                isOnline ? 'bg-green-500' : 'bg-red-500',
                'translate-y-0'
            )}
            style={{
                animation: 'slideDown 300ms ease-out',
            }}
        >
            <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>

            {isOnline ? (
                <>
                    <Wifi className="w-4 h-4" />
                    <span>{syncMessage}</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-4 h-4" />
                    <span>You are offline. Bills will be saved locally and synced when connection restores.</span>
                </>
            )}
        </div>
    );
}

