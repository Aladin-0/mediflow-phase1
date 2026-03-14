import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

export function useOutletId(): string {
    const { outlet } = useAuthStore();
    const { selectedOutletId } = useSettingsStore();
    return selectedOutletId ?? outlet?.id ?? '';
}
