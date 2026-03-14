import { StaffMember } from '../types';

export const mockStaff: StaffMember[] = [
    {
        id: "staff-001",
        outletId: "outlet-001",
        name: "Rajesh Patil",
        phone: "9876543210",
        role: "super_admin",
        staffPin: "0000",
        maxDiscount: 30,
        canEditRate: true,
        canViewPurchaseRates: true,
        canCreatePurchases: true,
        canAccessReports: true,
        isActive: true,
        joiningDate: "2024-01-01T00:00:00Z"
    },
    {
        id: "staff-002",
        outletId: "outlet-001",
        name: "Priya Sharma",
        phone: "9123456789",
        role: "admin",
        staffPin: "1234",
        maxDiscount: 20,
        canEditRate: true,
        canViewPurchaseRates: true,
        canCreatePurchases: true,
        canAccessReports: true,
        isActive: true,
        joiningDate: "2024-02-01T00:00:00Z"
    },
    {
        id: "staff-003",
        outletId: "outlet-001",
        name: "Rahul Kumar",
        phone: "9234567890",
        role: "manager",
        staffPin: "2345",
        maxDiscount: 15,
        canEditRate: false,
        canViewPurchaseRates: true,
        canCreatePurchases: true,
        canAccessReports: false,
        isActive: true,
        joiningDate: "2024-03-01T00:00:00Z"
    },
    {
        id: "staff-004",
        outletId: "outlet-001",
        name: "Sunita Devi",
        phone: "9345678901",
        role: "billing_staff",
        staffPin: "4821",
        maxDiscount: 10,
        canEditRate: false,
        canViewPurchaseRates: false,
        canCreatePurchases: false,
        canAccessReports: false,
        isActive: true,
        joiningDate: "2024-04-01T00:00:00Z"
    },
    {
        id: "staff-005",
        outletId: "outlet-001",
        name: "Amit Singh",
        phone: "9456789012",
        role: "billing_staff",
        staffPin: "3567",
        maxDiscount: 5,
        canEditRate: false,
        canViewPurchaseRates: false,
        canCreatePurchases: false,
        canAccessReports: false,
        isActive: true,
        joiningDate: "2024-05-01T00:00:00Z"
    }
];
