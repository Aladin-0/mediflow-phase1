import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { productsApi } from '@/lib/apiClient'
import { useAuthStore } from '@/store/authStore'

export function useProductSearch(query: string) {
    const [debouncedQuery] = useDebounce(query, 150)
    const user = useAuthStore(state => state.user)

    return useQuery({
        queryKey: ['products', 'search', debouncedQuery, user?.outletId],
        queryFn: () => {
            if (!user?.outletId) return Promise.resolve([])
            return productsApi.search(debouncedQuery, user.outletId)
        },
        enabled: debouncedQuery.length >= 2 && !!user?.outletId,
        staleTime: 1000 * 60, // 1 minute
        placeholderData: keepPreviousData,
    })
}
