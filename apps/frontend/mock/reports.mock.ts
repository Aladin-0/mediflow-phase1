import {
    SalesReportRow,
    GSTSummary,
    StockValuationRow,
    ExpiryReportRow,
    StaffReportRow,
    PurchaseReportRow,
} from '../types';

// ─── Sales Report Data ────────────────────────────────────────────────────
// March 1–14, 2026. Today is 2026-03-14.
// Target: ~712 bills, ₹2,85,400 sales, ₹18,200 discount, ₹34,248 tax

export const mockSalesReportData: SalesReportRow[] = [
    // Mar 1 (Sun)
    { date: '2026-03-01', invoiceCount: 22, totalSales: 8800, totalDiscount: 560, totalTax: 1056, netSales: 8800, cashSales: 4990, upiSales: 2420, cardSales: 880, creditSales: 510 },
    // Mar 2 (Mon)
    { date: '2026-03-02', invoiceCount: 45, totalSales: 18000, totalDiscount: 1148, totalTax: 2160, netSales: 18000, cashSales: 10206, upiSales: 4950, cardSales: 1800, creditSales: 1044 },
    // Mar 3 (Tue)
    { date: '2026-03-03', invoiceCount: 50, totalSales: 20000, totalDiscount: 1276, totalTax: 2400, netSales: 20000, cashSales: 11340, upiSales: 5500, cardSales: 2000, creditSales: 1160 },
    // Mar 4 (Wed)
    { date: '2026-03-04', invoiceCount: 52, totalSales: 20800, totalDiscount: 1326, totalTax: 2496, netSales: 20800, cashSales: 11793, upiSales: 5720, cardSales: 2080, creditSales: 1207 },
    // Mar 5 (Thu)
    { date: '2026-03-05', invoiceCount: 55, totalSales: 22000, totalDiscount: 1402, totalTax: 2640, netSales: 22000, cashSales: 12474, upiSales: 6050, cardSales: 2200, creditSales: 1276 },
    // Mar 6 (Fri)
    { date: '2026-03-06', invoiceCount: 60, totalSales: 24000, totalDiscount: 1530, totalTax: 2880, netSales: 24000, cashSales: 13608, upiSales: 6600, cardSales: 2400, creditSales: 1392 },
    // Mar 7 (Sat)
    { date: '2026-03-07', invoiceCount: 65, totalSales: 26000, totalDiscount: 1657, totalTax: 3120, netSales: 26000, cashSales: 14742, upiSales: 7150, cardSales: 2600, creditSales: 1508 },
    // Mar 8 (Sun)
    { date: '2026-03-08', invoiceCount: 25, totalSales: 10000, totalDiscount: 638, totalTax: 1200, netSales: 10000, cashSales: 5670, upiSales: 2750, cardSales: 1000, creditSales: 580 },
    // Mar 9 (Mon)
    { date: '2026-03-09', invoiceCount: 46, totalSales: 18400, totalDiscount: 1173, totalTax: 2208, netSales: 18400, cashSales: 10433, upiSales: 5060, cardSales: 1840, creditSales: 1067 },
    // Mar 10 (Tue)
    { date: '2026-03-10', invoiceCount: 51, totalSales: 20400, totalDiscount: 1301, totalTax: 2448, netSales: 20400, cashSales: 11567, upiSales: 5610, cardSales: 2040, creditSales: 1183 },
    // Mar 11 (Wed)
    { date: '2026-03-11', invoiceCount: 53, totalSales: 21200, totalDiscount: 1351, totalTax: 2544, netSales: 21200, cashSales: 12020, upiSales: 5830, cardSales: 2120, creditSales: 1230 },
    // Mar 12 (Thu)
    { date: '2026-03-12', invoiceCount: 56, totalSales: 22400, totalDiscount: 1428, totalTax: 2688, netSales: 22400, cashSales: 12701, upiSales: 6160, cardSales: 2240, creditSales: 1299 },
    // Mar 13 (Fri)
    { date: '2026-03-13', invoiceCount: 62, totalSales: 24800, totalDiscount: 1581, totalTax: 2976, netSales: 24800, cashSales: 14062, upiSales: 6820, cardSales: 2480, creditSales: 1438 },
    // Mar 14 (Sat)
    { date: '2026-03-14', invoiceCount: 70, totalSales: 28600, totalDiscount: 1829, totalTax: 3432, netSales: 28600, cashSales: 16394, upiSales: 7780, cardSales: 2920, creditSales: 1506 },
];

// Feb 2026 summary for comparison (previous month)
export const mockSalesReportFeb2026: SalesReportRow[] = [
    { date: '2026-02-01', invoiceCount: 42, totalSales: 16800, totalDiscount: 1074, totalTax: 2016, netSales: 16800, cashSales: 9526, upiSales: 4620, cardSales: 1680, creditSales: 974 },
    { date: '2026-02-02', invoiceCount: 48, totalSales: 19200, totalDiscount: 1228, totalTax: 2304, netSales: 19200, cashSales: 10886, upiSales: 5280, cardSales: 1920, creditSales: 1114 },
    { date: '2026-02-03', invoiceCount: 51, totalSales: 20400, totalDiscount: 1303, totalTax: 2448, netSales: 20400, cashSales: 11567, upiSales: 5610, cardSales: 2040, creditSales: 1183 },
    { date: '2026-02-04', invoiceCount: 54, totalSales: 21600, totalDiscount: 1380, totalTax: 2592, netSales: 21600, cashSales: 12247, upiSales: 5940, cardSales: 2160, creditSales: 1253 },
    { date: '2026-02-05', invoiceCount: 58, totalSales: 23200, totalDiscount: 1480, totalTax: 2784, netSales: 23200, cashSales: 13154, upiSales: 6380, cardSales: 2320, creditSales: 1346 },
    { date: '2026-02-06', invoiceCount: 21, totalSales: 8400, totalDiscount: 536, totalTax: 1008, netSales: 8400, cashSales: 4763, upiSales: 2310, cardSales: 840, creditSales: 487 },
    { date: '2026-02-07', invoiceCount: 62, totalSales: 24800, totalDiscount: 1581, totalTax: 2976, netSales: 24800, cashSales: 14062, upiSales: 6820, cardSales: 2480, creditSales: 1438 },
    { date: '2026-02-08', invoiceCount: 66, totalSales: 26400, totalDiscount: 1685, totalTax: 3168, netSales: 26400, cashSales: 14969, upiSales: 7260, cardSales: 2640, creditSales: 1531 },
    { date: '2026-02-09', invoiceCount: 44, totalSales: 17600, totalDiscount: 1123, totalTax: 2112, netSales: 17600, cashSales: 9979, upiSales: 4840, cardSales: 1760, creditSales: 1021 },
    { date: '2026-02-10', invoiceCount: 50, totalSales: 20000, totalDiscount: 1276, totalTax: 2400, netSales: 20000, cashSales: 11340, upiSales: 5500, cardSales: 2000, creditSales: 1160 },
    { date: '2026-02-11', invoiceCount: 53, totalSales: 21200, totalDiscount: 1351, totalTax: 2544, netSales: 21200, cashSales: 12020, upiSales: 5830, cardSales: 2120, creditSales: 1230 },
    { date: '2026-02-12', invoiceCount: 57, totalSales: 22800, totalDiscount: 1456, totalTax: 2736, netSales: 22800, cashSales: 12928, upiSales: 6270, cardSales: 2280, creditSales: 1322 },
    { date: '2026-02-13', invoiceCount: 22, totalSales: 8800, totalDiscount: 561, totalTax: 1056, netSales: 8800, cashSales: 4990, upiSales: 2420, cardSales: 880, creditSales: 510 },
    { date: '2026-02-14', invoiceCount: 63, totalSales: 25200, totalDiscount: 1608, totalTax: 3024, netSales: 25200, cashSales: 14289, upiSales: 6930, cardSales: 2520, creditSales: 1461 },
    { date: '2026-02-15', invoiceCount: 67, totalSales: 26800, totalDiscount: 1710, totalTax: 3216, netSales: 26800, cashSales: 15196, upiSales: 7370, cardSales: 2680, creditSales: 1554 },
    { date: '2026-02-16', invoiceCount: 46, totalSales: 18400, totalDiscount: 1173, totalTax: 2208, netSales: 18400, cashSales: 10433, upiSales: 5060, cardSales: 1840, creditSales: 1067 },
    { date: '2026-02-17', invoiceCount: 48, totalSales: 19200, totalDiscount: 1228, totalTax: 2304, netSales: 19200, cashSales: 10886, upiSales: 5280, cardSales: 1920, creditSales: 1114 },
    { date: '2026-02-18', invoiceCount: 51, totalSales: 20400, totalDiscount: 1303, totalTax: 2448, netSales: 20400, cashSales: 11567, upiSales: 5610, cardSales: 2040, creditSales: 1183 },
    { date: '2026-02-19', invoiceCount: 54, totalSales: 21600, totalDiscount: 1380, totalTax: 2592, netSales: 21600, cashSales: 12247, upiSales: 5940, cardSales: 2160, creditSales: 1253 },
    { date: '2026-02-20', invoiceCount: 23, totalSales: 9200, totalDiscount: 587, totalTax: 1104, netSales: 9200, cashSales: 5216, upiSales: 2530, cardSales: 920, creditSales: 534 },
    { date: '2026-02-21', invoiceCount: 60, totalSales: 24000, totalDiscount: 1531, totalTax: 2880, netSales: 24000, cashSales: 13608, upiSales: 6600, cardSales: 2400, creditSales: 1392 },
    { date: '2026-02-22', invoiceCount: 64, totalSales: 25600, totalDiscount: 1634, totalTax: 3072, netSales: 25600, cashSales: 14515, upiSales: 7040, cardSales: 2560, creditSales: 1485 },
    { date: '2026-02-23', invoiceCount: 43, totalSales: 17200, totalDiscount: 1098, totalTax: 2064, netSales: 17200, cashSales: 9752, upiSales: 4730, cardSales: 1720, creditSales: 998 },
    { date: '2026-02-24', invoiceCount: 49, totalSales: 19600, totalDiscount: 1252, totalTax: 2352, netSales: 19600, cashSales: 11113, upiSales: 5390, cardSales: 1960, creditSales: 1137 },
    { date: '2026-02-25', invoiceCount: 52, totalSales: 20800, totalDiscount: 1326, totalTax: 2496, netSales: 20800, cashSales: 11793, upiSales: 5720, cardSales: 2080, creditSales: 1207 },
    { date: '2026-02-26', invoiceCount: 56, totalSales: 22400, totalDiscount: 1428, totalTax: 2688, netSales: 22400, cashSales: 12701, upiSales: 6160, cardSales: 2240, creditSales: 1299 },
    { date: '2026-02-27', invoiceCount: 23, totalSales: 9200, totalDiscount: 587, totalTax: 1104, netSales: 9200, cashSales: 5216, upiSales: 2530, cardSales: 920, creditSales: 534 },
    { date: '2026-02-28', invoiceCount: 65, totalSales: 26000, totalDiscount: 1658, totalTax: 3120, netSales: 26000, cashSales: 14742, upiSales: 7150, cardSales: 2600, creditSales: 1508 },
];

// ─── GST Report Data ──────────────────────────────────────────────────────

export const mockGSTSummary: GSTSummary = {
    period: { from: '2026-03-01', to: '2026-03-14', period: 'this_month' },
    outletGstin: '27AABCA1234A1Z5',
    outletName: 'Ahilyanagar Main Branch',
    rows: [
        {
            hsnCode: '30049011',
            productName: 'Paracetamol / Dolo 650 / Crocin',
            taxableAmount: 62180,
            cgstRate: 2.5,
            cgstAmount: 1554.50,
            sgstRate: 2.5,
            sgstAmount: 1554.50,
            totalTax: 3109,
            totalAmount: 65289,
        },
        {
            hsnCode: '30049099',
            productName: 'Metformin / Amoxicillin / Azithromycin',
            taxableAmount: 45320,
            cgstRate: 6,
            cgstAmount: 2719.20,
            sgstRate: 6,
            sgstAmount: 2719.20,
            totalTax: 5438.40,
            totalAmount: 50758.40,
        },
        {
            hsnCode: '30049099',
            productName: 'Cetirizine / Vitamins / Pan-D',
            taxableAmount: 21400,
            cgstRate: 9,
            cgstAmount: 1926,
            sgstRate: 9,
            sgstAmount: 1926,
            totalTax: 3852,
            totalAmount: 25252,
        },
        {
            hsnCode: '30039090',
            productName: 'Insulin (Exempt)',
            taxableAmount: 18600,
            cgstRate: 0,
            cgstAmount: 0,
            sgstRate: 0,
            sgstAmount: 0,
            totalTax: 0,
            totalAmount: 18600,
        },
    ],
    totals: {
        taxableAmount: 147500,
        cgstAmount: 6199.70,
        sgstAmount: 6199.70,
        totalTax: 12399.40,
        totalAmount: 159899.40,
    },
    gstSlabBreakup: [
        { rate: 0,  taxableAmount: 18600,  taxAmount: 0       },
        { rate: 5,  taxableAmount: 62180,  taxAmount: 3109    },
        { rate: 12, taxableAmount: 45320,  taxAmount: 5438.40 },
        { rate: 18, taxableAmount: 21400,  taxAmount: 3852    },
    ],
};

// ─── Stock Valuation Data ─────────────────────────────────────────────────
// Based on mockProducts batches with realistic pharmacy quantities
// Total stockValue ≈ ₹1,84,960 | Total MRPValue ≈ ₹2,34,390

export const mockStockValuation: StockValuationRow[] = [
    { productId: 'prod-001', productName: 'Metformin 500mg Tablet',    composition: 'Metformin Hydrochloride 500mg', batchNo: 'MF2025A1', expiryDate: '2027-03-31', qtyStrips: 400, purchaseRate: 28, mrp: 37, saleRate: 35, stockValue: 11200, mrpValue: 14800 },
    { productId: 'prod-001', productName: 'Metformin 500mg Tablet',    composition: 'Metformin Hydrochloride 500mg', batchNo: 'MF2025B2', expiryDate: '2027-08-31', qtyStrips: 600, purchaseRate: 29, mrp: 37, saleRate: 35, stockValue: 17400, mrpValue: 22200 },
    { productId: 'prod-002', productName: 'Paracetamol 500mg Tablet',  composition: 'Paracetamol 500mg',            batchNo: 'PC2025X1', expiryDate: '2026-06-30', qtyStrips: 100, purchaseRate: 9,  mrp: 11, saleRate: 10, stockValue: 900,   mrpValue: 1100  },
    { productId: 'prod-002', productName: 'Paracetamol 500mg Tablet',  composition: 'Paracetamol 500mg',            batchNo: 'PC2025X2', expiryDate: '2027-05-31', qtyStrips: 800, purchaseRate: 9,  mrp: 11, saleRate: 10, stockValue: 7200,  mrpValue: 8800  },
    { productId: 'prod-003', productName: 'Alprazolam 0.25mg Tablet',  composition: 'Alprazolam 0.25mg',            batchNo: 'AL2025P1', expiryDate: '2027-01-31', qtyStrips: 200, purchaseRate: 16, mrp: 20, saleRate: 19, stockValue: 3200,  mrpValue: 4000  },
    { productId: 'prod-004', productName: 'Amoxicillin 500mg Capsule', composition: 'Amoxicillin Trihydrate 500mg', batchNo: 'AM2025A1', expiryDate: '2027-06-30', qtyStrips: 350, purchaseRate: 55, mrp: 72, saleRate: 68, stockValue: 19250, mrpValue: 25200 },
    { productId: 'prod-005', productName: 'Pan-D Capsule',             composition: 'Pantoprazole 40mg + Domperidone 10mg', batchNo: 'PD2025A1', expiryDate: '2027-09-30', qtyStrips: 450, purchaseRate: 82, mrp: 104, saleRate: 98, stockValue: 36900, mrpValue: 46800 },
    { productId: 'prod-006', productName: 'Azithromycin 500mg Tablet', composition: 'Azithromycin 500mg',           batchNo: 'AZ2025C1', expiryDate: '2027-04-30', qtyStrips: 350, purchaseRate: 60, mrp: 76, saleRate: 72, stockValue: 21000, mrpValue: 26600 },
    { productId: 'prod-007', productName: 'Dolo 650 Tablet',           composition: 'Paracetamol 650mg',            batchNo: 'DL2025M1', expiryDate: '2026-05-31', qtyStrips: 20,  purchaseRate: 18, mrp: 22, saleRate: 21, stockValue: 360,   mrpValue: 440   },
    { productId: 'prod-007', productName: 'Dolo 650 Tablet',           composition: 'Paracetamol 650mg',            batchNo: 'DL2025M2', expiryDate: '2027-12-31', qtyStrips: 600, purchaseRate: 18, mrp: 22, saleRate: 21, stockValue: 10800, mrpValue: 13200 },
    { productId: 'prod-008', productName: 'Crocin Advance 500mg',      composition: 'Paracetamol 500mg',            batchNo: 'CR2025G1', expiryDate: '2028-01-31', qtyStrips: 450, purchaseRate: 35, mrp: 44, saleRate: 42, stockValue: 15750, mrpValue: 19800 },
    { productId: 'prod-009', productName: 'Atorvastatin 10mg',         composition: 'Atorvastatin Calcium 10mg',    batchNo: 'AT2025R1', expiryDate: '2027-11-30', qtyStrips: 325, purchaseRate: 40, mrp: 50, saleRate: 48, stockValue: 13000, mrpValue: 16250 },
    { productId: 'prod-010', productName: 'Becosules Capsule',         composition: 'Vitamin B Complex + Vitamin C', batchNo: 'BC2025P1', expiryDate: '2027-07-31', qtyStrips: 400, purchaseRate: 70, mrp: 88, saleRate: 84, stockValue: 28000, mrpValue: 35200 },
];

// ─── Expiry Report Data ───────────────────────────────────────────────────
// Today = 2026-03-14. Sorted by daysRemaining ASC (critical first).

export const mockExpiryReport: ExpiryReportRow[] = [
    // Expired
    { productName: 'Vitamin C 500mg Tablet',   batchNo: 'VC2024M1', expiryDate: '2026-01-31', daysRemaining: -42, qtyStrips: 30,  mrp: 95,  stockValue: 1800, distributorName: 'Cipla Direct' },
    { productName: 'Cough Syrup 100ml',        batchNo: 'CS2025B1', expiryDate: '2026-02-28', daysRemaining: -14, qtyStrips: 12,  mrp: 68,  stockValue: 540,  distributorName: 'Ajanta Pharma Distributors' },
    // 0–30 days (critical)
    { productName: 'Metronidazole 400mg',      batchNo: 'MT2025A1', expiryDate: '2026-03-31', daysRemaining: 17,  qtyStrips: 45,  mrp: 28,  stockValue: 720,  distributorName: 'Sun Pharma Wholesale' },
    { productName: 'Cetirizine 10mg Tablet',   batchNo: 'CT2025C1', expiryDate: '2026-04-10', daysRemaining: 27,  qtyStrips: 60,  mrp: 32,  stockValue: 1080, distributorName: 'Ajanta Pharma Distributors' },
    // 31–90 days (warning)
    { productName: 'Dolo 650 Tablet',          batchNo: 'DL2025M1', expiryDate: '2026-05-31', daysRemaining: 78,  qtyStrips: 20,  mrp: 22,  stockValue: 360,  distributorName: 'Ajanta Pharma Distributors' },
    { productName: 'Combiflam 400mg',          batchNo: 'CB2025S1', expiryDate: '2026-06-05', daysRemaining: 83,  qtyStrips: 35,  mrp: 45,  stockValue: 1050, distributorName: 'Cipla Direct' },
    { productName: 'Ibuprofen 400mg Tablet',   batchNo: 'IB2025A1', expiryDate: '2026-06-10', daysRemaining: 88,  qtyStrips: 50,  mrp: 38,  stockValue: 1140, distributorName: 'Sun Pharma Wholesale' },
    // 91–180 days (caution)
    { productName: 'Paracetamol 500mg Tablet', batchNo: 'PC2025X1', expiryDate: '2026-06-30', daysRemaining: 108, qtyStrips: 100, mrp: 11,  stockValue: 900,  distributorName: 'Ajanta Pharma Distributors' },
    { productName: 'Insulin Regular 10ml',     batchNo: 'IN2025B1', expiryDate: '2026-07-31', daysRemaining: 139, qtyStrips: 8,   mrp: 240, stockValue: 1360, distributorName: 'Sun Pharma Wholesale' },
    { productName: 'Ondansetron 4mg Tablet',   batchNo: 'ON2025A1', expiryDate: '2026-08-15', daysRemaining: 154, qtyStrips: 40,  mrp: 55,  stockValue: 1320, distributorName: 'Cipla Direct' },
    { productName: 'Omeprazole 20mg Capsule',  batchNo: 'OM2025C1', expiryDate: '2026-09-01', daysRemaining: 171, qtyStrips: 80,  mrp: 48,  stockValue: 2400, distributorName: 'Ajanta Pharma Distributors' },
    { productName: 'Ranitidine 150mg Tablet',  batchNo: 'RN2025P1', expiryDate: '2026-09-10', daysRemaining: 180, qtyStrips: 55,  mrp: 35,  stockValue: 1210, distributorName: 'Sun Pharma Wholesale' },
    // Safe batches
    { productName: 'Metformin 500mg Tablet',   batchNo: 'MF2025A1', expiryDate: '2027-03-31', daysRemaining: 382, qtyStrips: 400, mrp: 37,  stockValue: 11200, distributorName: 'Cipla Direct' },
    { productName: 'Metformin 500mg Tablet',   batchNo: 'MF2025B2', expiryDate: '2027-08-31', daysRemaining: 535, qtyStrips: 600, mrp: 37,  stockValue: 17400, distributorName: 'Cipla Direct' },
    { productName: 'Alprazolam 0.25mg Tablet', batchNo: 'AL2025P1', expiryDate: '2027-01-31', daysRemaining: 323, qtyStrips: 200, mrp: 20,  stockValue: 3200, distributorName: 'Ajanta Pharma Distributors' },
    { productName: 'Amoxicillin 500mg Capsule',batchNo: 'AM2025A1', expiryDate: '2027-06-30', daysRemaining: 473, qtyStrips: 350, mrp: 72,  stockValue: 19250, distributorName: 'Sun Pharma Wholesale' },
    { productName: 'Pan-D Capsule',            batchNo: 'PD2025A1', expiryDate: '2027-09-30', daysRemaining: 565, qtyStrips: 450, mrp: 104, stockValue: 36900, distributorName: 'Ajanta Pharma Distributors' },
    { productName: 'Azithromycin 500mg Tablet',batchNo: 'AZ2025C1', expiryDate: '2027-04-30', daysRemaining: 412, qtyStrips: 350, mrp: 76,  stockValue: 21000, distributorName: 'Cipla Direct' },
    { productName: 'Dolo 650 Tablet',          batchNo: 'DL2025M2', expiryDate: '2027-12-31', daysRemaining: 657, qtyStrips: 600, mrp: 22,  stockValue: 10800, distributorName: 'Ajanta Pharma Distributors' },
    { productName: 'Crocin Advance 500mg',     batchNo: 'CR2025G1', expiryDate: '2028-01-31', daysRemaining: 688, qtyStrips: 450, mrp: 44,  stockValue: 15750, distributorName: 'Sun Pharma Wholesale' },
    { productName: 'Atorvastatin 10mg',        batchNo: 'AT2025R1', expiryDate: '2027-11-30', daysRemaining: 626, qtyStrips: 325, mrp: 50,  stockValue: 13000, distributorName: 'Cipla Direct' },
    { productName: 'Paracetamol 500mg Tablet', batchNo: 'PC2025X2', expiryDate: '2027-05-31', daysRemaining: 443, qtyStrips: 800, mrp: 11,  stockValue: 7200, distributorName: 'Sun Pharma Wholesale' },
    { productName: 'Becosules Capsule',        batchNo: 'BC2025P1', expiryDate: '2027-07-31', daysRemaining: 504, qtyStrips: 400, mrp: 88,  stockValue: 28000, distributorName: 'Ajanta Pharma Distributors' },
];

// ─── Staff Report Data ────────────────────────────────────────────────────

export const mockStaffReport: StaffReportRow[] = [
    {
        staffId: 'staff-004',
        staffName: 'Sunita Devi',
        role: 'billing_staff',
        billsCount: 342,
        totalSales: 132800,
        avgBillValue: 388,
        totalDiscount: 8450,
        avgDiscountPct: 6.4,
        cashBills: 228,
        creditBills: 21,
    },
    {
        staffId: 'staff-003',
        staffName: 'Rahul Kumar',
        role: 'manager',
        billsCount: 218,
        totalSales: 84600,
        avgBillValue: 388,
        totalDiscount: 5390,
        avgDiscountPct: 6.4,
        cashBills: 145,
        creditBills: 14,
    },
    {
        staffId: 'staff-005',
        staffName: 'Amit Singh',
        role: 'billing_staff',
        billsCount: 145,
        totalSales: 46400,
        avgBillValue: 320,
        totalDiscount: 2960,
        avgDiscountPct: 6.4,
        cashBills: 97,
        creditBills: 9,
    },
    {
        staffId: 'staff-002',
        staffName: 'Priya Sharma',
        role: 'admin',
        billsCount: 67,
        totalSales: 15200,
        avgBillValue: 227,
        totalDiscount: 970,
        avgDiscountPct: 6.4,
        cashBills: 45,
        creditBills: 4,
    },
    {
        staffId: 'staff-001',
        staffName: 'Rajesh Patil',
        role: 'super_admin',
        billsCount: 12,
        totalSales: 6400,
        avgBillValue: 533,
        totalDiscount: 408,
        avgDiscountPct: 6.4,
        cashBills: 8,
        creditBills: 1,
    },
];

// ─── Purchase Report Data ─────────────────────────────────────────────────
// Dynamic dates based on today = 2026-03-14

const today = new Date('2026-03-14');
const fmt = (d: Date) => d.toISOString().split('T')[0];
const dMinus = (n: number) => fmt(new Date(today.getTime() - n * 86400000));

export const mockPurchaseReport: PurchaseReportRow[] = [
    {
        date: dMinus(45),
        invoiceNo: 'AJD-2026-0071',
        distributorName: 'Ajanta Pharma Distributors',
        itemCount: 2,
        subtotal: 22000,
        discountAmount: 0,
        taxAmount: 2357.14,
        grandTotal: 22000,
        amountPaid: 0,
        outstanding: 22000,
    },
    {
        date: dMinus(10),
        invoiceNo: 'AJD-2026-0089',
        distributorName: 'Ajanta Pharma Distributors',
        itemCount: 2,
        subtotal: 12450,
        discountAmount: 0,
        taxAmount: 1333.93,
        grandTotal: 12450,
        amountPaid: 12450,
        outstanding: 0,
    },
    {
        date: dMinus(5),
        invoiceNo: 'AJD-2026-0102',
        distributorName: 'Ajanta Pharma Distributors',
        itemCount: 2,
        subtotal: 8900,
        discountAmount: 0,
        taxAmount: 953.57,
        grandTotal: 8900,
        amountPaid: 0,
        outstanding: 8900,
    },
    {
        date: dMinus(3),
        invoiceNo: 'SPW-2026-0234',
        distributorName: 'Sun Pharma Wholesale',
        itemCount: 2,
        subtotal: 15600,
        discountAmount: 0,
        taxAmount: 1671.43,
        grandTotal: 15600,
        amountPaid: 5000,
        outstanding: 10600,
    },
    {
        date: fmt(today),
        invoiceNo: 'CIPLA-2026-1123',
        distributorName: 'Cipla Direct',
        itemCount: 2,
        subtotal: 6300,
        discountAmount: 0,
        taxAmount: 675,
        grandTotal: 6300,
        amountPaid: 6300,
        outstanding: 0,
    },
];
