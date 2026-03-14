'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { StockFilters, DrugSchedule } from '@/types';

export function useInventoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const filters: StockFilters = {
        search: searchParams.get('q') ?? '',
        scheduleType: (searchParams.get('schedule') as DrugSchedule) ?? 'all',
        lowStock: searchParams.get('lowStock') === 'true',
        expiringSoon: searchParams.get('expiring') === 'true',
        sortBy: (searchParams.get('sort') as StockFilters['sortBy']) ?? 'name',
        sortOrder: (searchParams.get('order') as 'asc' | 'desc') ?? 'asc',
    };

    const setFilter = (key: string, value: string | boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === '' || value === false || value === 'all') {
            params.delete(key);
        } else {
            params.set(key, String(value));
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.replace(pathname, { scroll: false });
    };

    return { filters, setFilter, clearFilters };
}
