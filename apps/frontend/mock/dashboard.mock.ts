import { DashboardKPI, DashboardAlerts } from '../types';

export const mockDashboardKPI: DashboardKPI = {
    date: new Date().toISOString().split('T')[0], // Today's date
    totalSales: 18450,
    totalBills: 47,
    cashCollected: 10200,
    upiCollected: 6300,
    cardCollected: 1000,
    creditGiven: 950,
    totalDiscount: 1240,
    totalGst: 2214,
    topSellingItems: [
        { name: "Dolo 650 Tablet", qty: 45, revenue: 1260 },
        { name: "Pan-D Capsule", qty: 32, revenue: 3680 },
        { name: "Metformin 500mg Tablet", qty: 28, revenue: 1064 },
        { name: "Azithromycin 500mg Tablet", qty: 18, revenue: 1530 },
        { name: "Paracetamol 500mg Tablet", qty: 55, revenue: 880 }
    ],
    staffLeaderboard: [
        { staffId: "staff-004", name: "Sunita Devi", billsCount: 23, totalSales: 8930 },
        { staffId: "staff-003", name: "Rahul Kumar", billsCount: 18, totalSales: 7450 },
        { staffId: "staff-002", name: "Priya Sharma", billsCount: 5, totalSales: 2100 }
    ],
    hourlySales: [
        { hour: "09:00", bills: 3, sales: 850 },
        { hour: "10:00", bills: 8, sales: 3200 }, // morning peak
        { hour: "11:00", bills: 5, sales: 1900 },
        { hour: "12:00", bills: 4, sales: 1400 },
        { hour: "13:00", bills: 2, sales: 620 },
        { hour: "14:00", bills: 3, sales: 980 },
        { hour: "15:00", bills: 4, sales: 1350 },
        { hour: "16:00", bills: 5, sales: 1800 },
        { hour: "17:00", bills: 6, sales: 2200 },
        { hour: "18:00", bills: 7, sales: 2800 }, // evening peak
        { hour: "19:00", bills: 5, sales: 1850 },
        { hour: "20:00", bills: 3, sales: 980 },
        { hour: "21:00", bills: 0, sales: 0 }
    ],
    paymentBreakdown: {
        cash: 10200,
        upi: 6300,
        card: 1000,
        credit: 950
    }
};

export const mockAlertSummary: DashboardAlerts = {
    lowStock: [
        { batch: { productName: "Dolo 650 Tablet", batchNumber: "DL123", expiryDate: "2026-05-31" }, currentStock: 3, reorderLevel: 20 },
        { batch: { productName: "Paracetamol 500mg Tablet", batchNumber: "PR456", expiryDate: "2026-06-30" }, currentStock: 11, reorderLevel: 15 }
    ],
    expiringSoon: [
        { batch: { productName: "Paracetamol 500mg Tablet", batchNumber: "PR456", expiryDate: "2026-06-30" }, daysUntilExpiry: 108 },
        { batch: { productName: "Dolo 650 Tablet", batchNumber: "DL123", expiryDate: "2026-05-31" }, daysUntilExpiry: 79 }
    ],
    overdueAccounts: [
        { customerId: "cust1", customerName: "Mohammad Shaikh", outstandingAmount: 1000, daysOverdue: 12 }
    ]
};
