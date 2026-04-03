import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { productsApi } from '@/lib/apiClient'
import { useOutletId } from '@/hooks/useOutletId'

export function useProductSearch(query: string) {
    const [debouncedQuery] = useDebounce(query, 150)
    const outletId = useOutletId()

    return useQuery({
        queryKey: ['products', 'search', debouncedQuery, outletId],
        queryFn: () => {
            if (!outletId) return Promise.resolve([])
            return productsApi.search(debouncedQuery, outletId)
        },
        enabled: debouncedQuery.length >= 2 && !!outletId,
        staleTime: 1000 * 60, // 1 minute
        placeholderData: keepPreviousData,
    })
}
