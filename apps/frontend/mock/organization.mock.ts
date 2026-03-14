import { Organization, Outlet } from '../types';

export const mockOrganizations: Organization[] = [
    {
        id: "org-001",
        name: "Apollo Medical Store",
        slug: "apollo-medical",
        plan: "pro",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z"
    }
];

export const mockOutlets: Outlet[] = [
    {
        id: "outlet-001",
        organizationId: "org-001",
        name: "Ahilyanagar Main Branch",
        address: "Shop No 5, Savedi Road",
        city: "Ahilyanagar",
        state: "Maharashtra",
        pincode: "414003",
        gstin: "27AABCA1234A1Z5",
        drugLicenseNo: "MH/AHM/001/2024",
        phone: "02412-245678",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z"
    },
    {
        id: "outlet-002",
        organizationId: "org-001",
        name: "Pune Branch",
        address: "Kothrud",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411038",
        gstin: "27AABCA1234A1Z6",
        drugLicenseNo: "MH/PUN/002/2024",
        phone: "020-25432109",
        isActive: true,
        createdAt: "2024-02-15T00:00:00Z"
    }
];
