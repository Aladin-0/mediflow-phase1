import { MasterProduct, Batch, ProductSearchResult } from '../types';

export const mockProducts: MasterProduct[] = [
    {
        id: "prod-001",
        name: "Metformin 500mg Tablet",
        composition: "Metformin Hydrochloride 500mg",
        manufacturer: "Cipla",
        category: "Anti-Diabetic",
        drugType: "allopathy",
        scheduleType: "H",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 10,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-002",
        name: "Paracetamol 500mg Tablet",
        composition: "Paracetamol 500mg",
        manufacturer: "Sun Pharma",
        category: "Analgesic",
        drugType: "allopathy",
        scheduleType: "OTC",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 15,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-003",
        name: "Alprazolam 0.25mg Tablet",
        composition: "Alprazolam 0.25mg",
        manufacturer: "Pfizer",
        category: "Anti-Anxiety",
        drugType: "allopathy",
        scheduleType: "H1",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 10,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-004",
        name: "Amoxicillin 500mg Capsule",
        composition: "Amoxicillin Trihydrate 500mg",
        manufacturer: "Alkem",
        category: "Antibiotics",
        drugType: "allopathy",
        scheduleType: "H",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 10,
        packUnit: "capsule",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-005",
        name: "Pan-D Capsule",
        composition: "Pantoprazole 40mg + Domperidone 10mg",
        manufacturer: "Alkem",
        category: "Antacid",
        drugType: "allopathy",
        scheduleType: "OTC",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 10,
        packUnit: "capsule",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-006",
        name: "Azithromycin 500mg Tablet",
        composition: "Azithromycin 500mg",
        manufacturer: "Cipla",
        category: "Antibiotics",
        drugType: "allopathy",
        scheduleType: "H",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 3,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-007",
        name: "Dolo 650 Tablet",
        composition: "Paracetamol 650mg",
        manufacturer: "Micro Labs",
        category: "Analgesic",
        drugType: "allopathy",
        scheduleType: "OTC",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 15,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-008",
        name: "Crocin Advance 500mg",
        composition: "Paracetamol 500mg",
        manufacturer: "GSK",
        category: "Analgesic",
        drugType: "allopathy",
        scheduleType: "OTC",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 20,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-009",
        name: "Atorvastatin 10mg",
        composition: "Atorvastatin Calcium 10mg",
        manufacturer: "Ranbaxy",
        category: "Statins",
        drugType: "allopathy",
        scheduleType: "H",
        hsnCode: "3004",
        gstRate: 12,
        packSize: 10,
        packUnit: "tablet",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    },
    {
        id: "prod-010",
        name: "Becosules Capsule",
        composition: "Vitamin B Complex + Vitamin C",
        manufacturer: "Pfizer",
        category: "Vitamins",
        drugType: "allopathy",
        scheduleType: "OTC",
        hsnCode: "3004",
        gstRate: 0,
        packSize: 20,
        packUnit: "capsule",
        packType: "strip",
        isFridge: false,
        isDiscontinued: false
    }
];

export const mockBatches: Batch[] = [
    { id: "batch-001", outletId: "outlet-001", outletProductId: "prod-001", batchNo: "MF2025A1", expiryDate: "2027-03-31", mrp: 42, purchaseRate: 28, saleRate: 38, qtyStrips: 45, qtyLoose: 7, isActive: true, createdAt: "2024-01-01T00:00:00Z" },
    { id: "batch-002", outletId: "outlet-001", outletProductId: "prod-001", batchNo: "MF2025B2", expiryDate: "2027-08-31", mrp: 44, purchaseRate: 29, saleRate: 39, qtyStrips: 80, qtyLoose: 0, isActive: true, createdAt: "2024-02-01T00:00:00Z" },
    { id: "batch-003", outletId: "outlet-001", outletProductId: "prod-002", batchNo: "PC2025X1", expiryDate: "2026-06-30", mrp: 18, purchaseRate: 9, saleRate: 16, qtyStrips: 8, qtyLoose: 3, isActive: true, createdAt: "2024-01-15T00:00:00Z" },
    { id: "batch-004", outletId: "outlet-001", outletProductId: "prod-002", batchNo: "PC2025X2", expiryDate: "2027-05-31", mrp: 18, purchaseRate: 9, saleRate: 16, qtyStrips: 120, qtyLoose: 0, isActive: true, createdAt: "2024-03-01T00:00:00Z" },
    { id: "batch-005", outletId: "outlet-001", outletProductId: "prod-003", batchNo: "AL2025P1", expiryDate: "2027-01-31", mrp: 28, purchaseRate: 16, saleRate: 24, qtyStrips: 20, qtyLoose: 4, isActive: true, createdAt: "2024-01-20T00:00:00Z" },
    { id: "batch-006", outletId: "outlet-001", outletProductId: "prod-004", batchNo: "AM2025A1", expiryDate: "2027-06-30", mrp: 85, purchaseRate: 55, saleRate: 75, qtyStrips: 35, qtyLoose: 0, isActive: true, createdAt: "2024-02-10T00:00:00Z" },
    { id: "batch-007", outletId: "outlet-001", outletProductId: "prod-005", batchNo: "PD2025A1", expiryDate: "2027-09-30", mrp: 128, purchaseRate: 82, saleRate: 115, qtyStrips: 55, qtyLoose: 6, isActive: true, createdAt: "2024-03-15T00:00:00Z" },
    { id: "batch-008", outletId: "outlet-001", outletProductId: "prod-006", batchNo: "AZ2025C1", expiryDate: "2027-04-30", mrp: 95, purchaseRate: 60, saleRate: 85, qtyStrips: 40, qtyLoose: 0, isActive: true, createdAt: "2024-04-01T00:00:00Z" },
    { id: "batch-009", outletId: "outlet-001", outletProductId: "prod-007", batchNo: "DL2025M1", expiryDate: "2026-05-31", mrp: 32, purchaseRate: 18, saleRate: 28, qtyStrips: 3, qtyLoose: 9, isActive: true, createdAt: "2024-01-05T00:00:00Z" },
    { id: "batch-010", outletId: "outlet-001", outletProductId: "prod-007", batchNo: "DL2025M2", expiryDate: "2027-12-31", mrp: 32, purchaseRate: 18, saleRate: 28, qtyStrips: 90, qtyLoose: 0, isActive: true, createdAt: "2024-05-01T00:00:00Z" },
    { id: "batch-011", outletId: "outlet-001", outletProductId: "prod-008", batchNo: "CR2025G1", expiryDate: "2028-01-31", mrp: 55, purchaseRate: 35, saleRate: 48, qtyStrips: 70, qtyLoose: 5, isActive: true, createdAt: "2024-04-15T00:00:00Z" },
    { id: "batch-012", outletId: "outlet-001", outletProductId: "prod-009", batchNo: "AT2025R1", expiryDate: "2027-11-30", mrp: 62, purchaseRate: 40, saleRate: 55, qtyStrips: 28, qtyLoose: 0, isActive: true, createdAt: "2024-02-28T00:00:00Z" },
    { id: "batch-013", outletId: "outlet-001", outletProductId: "prod-010", batchNo: "BC2025P1", expiryDate: "2027-07-31", mrp: 110, purchaseRate: 70, saleRate: 98, qtyStrips: 60, qtyLoose: 10, isActive: true, createdAt: "2024-03-20T00:00:00Z" }
];

export const getProductById = (id: string): MasterProduct | undefined => {
    return mockProducts.find(p => p.id === id);
};

export const searchProducts = (q: string): ProductSearchResult[] => {
    const query = q.toLowerCase();
    const matchedProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.composition.toLowerCase().includes(query) ||
        p.manufacturer.toLowerCase().includes(query)
    );

    return matchedProducts.map(p => {
        const productBatches = mockBatches.filter(b => b.outletProductId === p.id);
        const totalStock = productBatches.reduce((acc, curr) => acc + curr.qtyStrips, 0); // Simplified stock calculation
        const isLowStock = totalStock < 10;

        // Find nearest expiry
        const nearestExpiry = productBatches.length > 0
            ? productBatches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0].expiryDate
            : "2099-12-31";

        return {
            ...p,
            outletProductId: p.id, // Mocking that product is available in outlet
            totalStock,
            nearestExpiry,
            isLowStock,
            batches: productBatches
        };
    });
};
