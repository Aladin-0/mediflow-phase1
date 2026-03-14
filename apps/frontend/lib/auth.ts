import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { authApi } from './apiClient'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'

export async function handleLogout(router: AppRouterInstance) {
    try {
        await authApi.logout()
    } catch {
        // ignore — always proceed to logout client side
    } finally {
        useAuthStore.getState().logout()
        // Intentionally keep useSettingsStore state (e.g. printer configuration, sidebar preference)
        sessionStorage.removeItem('mediflow_mock_auth')

        // Clear the mock auth cookie if it was set
        document.cookie = 'mediflow_mock_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        router.push('/login')
    }
}
