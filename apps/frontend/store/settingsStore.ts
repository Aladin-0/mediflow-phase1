import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PrinterType = 'a4' | 'thermal_80mm' | 'thermal_57mm';
type ThemeType = 'light';

interface SettingsState {
    selectedOutletId: string | null;
    isSidebarCollapsed: boolean;
    printerType: PrinterType;
    theme: ThemeType;

    setOutletId: (id: string) => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (v: boolean) => void;
    setPrinterType: (t: PrinterType) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            selectedOutletId: null,
            isSidebarCollapsed: false,
            printerType: 'thermal_80mm',
            theme: 'light',

            setOutletId: (id) => set({ selectedOutletId: id }),
            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
            setSidebarCollapsed: (v) => set({ isSidebarCollapsed: v }),
            setPrinterType: (t) => set({ printerType: t }),
        }),
        {
            name: 'mediflow-settings',
            skipHydration: true,
        }
    )
);
