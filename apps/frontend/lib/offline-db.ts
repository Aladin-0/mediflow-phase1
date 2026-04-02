// C4: Offline billing removed. Mediflow is a connected POS — bills must be
// confirmed by the backend before stock is deducted. The Dexie IndexedDB queue
// that used to live here silently created OFFLINE-* invoices without deducting
// stock. All exports below are no-ops kept only to avoid breaking imports
// while OfflineBanner.tsx is updated in the same change.

export interface OfflineBill {
    id?: number;
    payload: object;
    createdAt: string;
    status: 'pending' | 'synced' | 'failed';
    retryCount: number;
}

// Removed: saveOfflineBill, getPendingBills, syncOfflineBills, MediFlowDB, db
export async function saveOfflineBill(_payload: object): Promise<void> {
    // intentionally empty — offline billing is disabled
}

export async function getPendingBills(): Promise<OfflineBill[]> {
    return [];
}

export async function syncOfflineBills(
    _syncApiCall: (payload: object) => Promise<void>
): Promise<{ totalAttempted: number; successCount: number }> {
    return { totalAttempted: 0, successCount: 0 };
}
