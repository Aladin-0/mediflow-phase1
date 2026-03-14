import { Doctor } from '../types';

export const mockDoctors: Doctor[] = [
    {
        id: "doc-001",
        outletId: "outlet-001",
        name: "Dr. Sanjay Mehta",
        phone: "9823401234",
        regNo: "MH/12345/2005",
        qualification: "MBBS, MD (Medicine)",
        specialty: "General Physician",
        isActive: true
    },
    {
        id: "doc-002",
        outletId: "outlet-001",
        name: "Dr. Rekha Iyer",
        phone: "9765409876",
        regNo: "MH/23456/2008",
        qualification: "MBBS, DM (Endocrinology)",
        specialty: "Endocrinologist",
        isActive: true
    },
    {
        id: "doc-003",
        outletId: "outlet-001",
        name: "Dr. Prakash Kulkarni",
        phone: "9012309012",
        regNo: "MH/34567/2001",
        qualification: "MBBS, MS (Ortho)",
        specialty: "Orthopedic Surgeon",
        isActive: true
    },
    {
        id: "doc-004",
        outletId: "outlet-001",
        name: "Dr. Fatima Sheikh",
        phone: "8890123456",
        regNo: "MH/45678/2015",
        qualification: "MBBS, DNB (Paediatrics)",
        specialty: "Paediatrician",
        isActive: true
    },
    {
        id: "doc-005",
        outletId: "outlet-001",
        name: "Dr. Vijay Kamble",
        phone: "7890124567",
        regNo: "MH/56789/2010",
        qualification: "MBBS, DGO",
        specialty: "Gynaecologist",
        isActive: true
    }
];
