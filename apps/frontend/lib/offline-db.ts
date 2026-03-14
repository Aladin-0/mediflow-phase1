import Dexie, { type Table } from 'dexie';

export interface OfflineBill {
    id?: number;          
    payload: object;      
    createdAt: string;
    status: 'pending' | 'synced' | 'failed';
    retryCount: number;
}

class MediFlowDB extends Dexie {
    offlineBills!: Table<OfflineBill>;

    constructor() {
        super('MediFlowDB');
        this.version(1).stores({
            offlineBills: '++id, status, createdAt', // Indexed fields
        });
    }
}

export const db = new MediFlowDB();

// Add a bill to the offline queue
export async function saveOfflineBill(payload: object) {
    return db.offlineBills.add({
        payload,
        createdAt: new Date().toISOString(),
        status: 'pending',
        retryCount: 0,
    });
}

// Fetch all pending bills
export async function getPendingBills() {
    return db.offlineBills
        .where('status')
        .equals('pending')
        .sortBy('createdAt');
}

// Will be used by background sync or OfflineBanner
export async function syncOfflineBills(
    syncApiCall: (payload: object) => Promise<void>
) {
    const pending = await getPendingBills();
    let successCount = 0;

    for (const bill of pending) {
        try {
            await syncApiCall(bill.payload);
            await db.offlineBills.update(bill.id!, {
                status: 'synced',
            });
            successCount++;
        } catch (error) {
            console.error('Failed to sync offline bill:', bill.id, error);
            const nextRetries = bill.retryCount + 1;
            await db.offlineBills.update(bill.id!, {
                retryCount: nextRetries,
                status: nextRetries >= 3 ? 'failed' : 'pending',
            });
        }
    }

    return { totalAttempted: pending.length, successCount };
}
