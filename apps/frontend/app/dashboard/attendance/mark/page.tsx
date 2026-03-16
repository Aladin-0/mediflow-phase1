'use client';

import { useRouter } from 'next/navigation';
import { KioskMode } from '@/components/attendance/KioskMode';

export default function KioskPage() {
    const router = useRouter();
    return (
        <KioskMode onExit={() => router.push('/dashboard/attendance')} />
    );
}
