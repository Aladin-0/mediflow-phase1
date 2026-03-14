import { Distributor } from '../types';

export const mockDistributors: Distributor[] = [
    {
        id: "dist-001",
        outletId: "outlet-001",
        name: "Ajanta Pharma Distributors",
        gstin: "27AAJCA1234B1Z3",
        drugLicenseNo: "MH/AHM/D/001/2024",
        phone: "02412-256789",
        email: "ajanta.ahm@gmail.com",
        address: "Shop 12, MIDC Road",
        city: "Ahilyanagar",
        state: "Maharashtra",
        creditDays: 30,
        openingBalance: 15000,
        balanceType: "CR", 
        isActive: true
    },
    {
        id: "dist-002",
        outletId: "outlet-001",
        name: "Sun Pharma Wholesale",
        gstin: "27AABCS1234C1Z7",
        phone: "020-27456789",
        city: "Pune",
        address: "Wholesale Market, Swargate",
        state: "Maharashtra",
        creditDays: 45,
        openingBalance: 8500,
        balanceType: "CR",
        isActive: true
    },
    {
        id: "dist-003",
        outletId: "outlet-001",
        name: "Cipla Direct",
        gstin: "27AAACC1234D1Z1",
        phone: "022-27654321",
        city: "Mumbai",
        address: "Andheri East",
        state: "Maharashtra",
        creditDays: 21,
        openingBalance: 0,
        balanceType: "CR",
        isActive: true
    }
];
