export type StaffRole =
    | 'super_admin'
    | 'admin'
    | 'manager'
    | 'billing_staff'
    | 'view_only';

export type DrugSchedule = 'OTC' | 'H' | 'H1' | 'X' | 'Narcotic';
export type DrugType = 'allopathy' | 'ayurveda' | 'homeo' | 'fmcg';
export type PaymentMode = 'cash' | 'upi' | 'card' | 'credit' | 'split';
export type SaleMode = 'strip' | 'loose' | 'bottle';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day';

export interface ApiResponse<T> {
    data: T;
    meta: { timestamp: string; version: string };
}

export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
    };
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    plan: 'starter' | 'pro' | 'enterprise';
    isActive: boolean;
    createdAt: string;
}

export interface Outlet {
    id: string;
    organizationId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string;
    drugLicenseNo: string;
    phone: string;
    logoUrl?: string;
    invoiceFooter?: string;
    isActive: boolean;
    createdAt: string;
}

export interface AuthUser {
    id: string;
    name: string;
    phone: string;
    role: StaffRole;
    staffPin: string;
    outletId: string;
    outlet: Outlet;
    avatarUrl?: string;
    maxDiscount: number;
    canEditRate: boolean;
    canViewPurchaseRates: boolean;
    canCreatePurchases: boolean;
    canAccessReports: boolean;
}

export interface LoginPayload {
    phone: string;
    password: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: AuthUser;
}

export interface StaffMember {
    id: string;
    outletId: string;
    name: string;
    phone: string;
    role: StaffRole;
    staffPin: string;
    avatarUrl?: string;
    maxDiscount: number;
    canEditRate: boolean;
    canViewPurchaseRates: boolean;
    canCreatePurchases: boolean;
    canAccessReports: boolean;
    isActive: boolean;
    joiningDate: string;
    lastLogin?: string;
}

export interface StaffPinVerifyResponse {
    id: string;
    name: string;
    role: StaffRole;
    staffPin: string;
    maxDiscount: number;
    canEditRate: boolean;
    billsToday: number;
    totalSalesToday: number;
}

export interface StaffPerformance {
    billsCount: number;
    totalSales: number;
    avgBillValue: number;
    topSellingItems: { name: string; qty: number; revenue: number }[];
    hourlyActivity: { hour: number; bills: number; sales: number }[];
}

export interface MasterProduct {
    id: string;
    name: string;
    composition: string;
    manufacturer: string;
    category: string;
    drugType: DrugType;
    scheduleType: DrugSchedule;
    hsnCode: string;
    gstRate: number;
    packSize: number;
    packUnit: string;
    packType: string;
    barcode?: string;
    isFridge: boolean;
    isDiscontinued: boolean;
    imageUrl?: string;
}

export interface Batch {
    id: string;
    outletId: string;
    outletProductId: string;
    batchNo: string;
    mfgDate?: string;
    expiryDate: string;
    mrp: number;
    purchaseRate: number;
    saleRate: number;
    qtyStrips: number;
    qtyLoose: number;
    rackLocation?: string;
    isActive: boolean;
    createdAt: string;
}

export interface ProductSearchResult extends MasterProduct {
    outletProductId: string;
    totalStock: number;
    nearestExpiry: string;
    isLowStock: boolean;
    batches: Batch[];
}

export interface Customer {
    id: string;
    outletId: string;
    name: string;
    phone: string;
    address?: string;
    dob?: string;
    gstin?: string;
    fixedDiscount: number;
    creditLimit: number;
    outstanding: number;
    totalPurchases: number;
    isChronic: boolean;
    createdAt: string;
}

export interface Doctor {
    id: string;
    outletId: string;
    name: string;
    phone: string;
    regNo: string;
    qualification: string;
    specialty: string;
    isActive: boolean;
}

export interface CartItem {
    batchId: string;
    productId: string;
    name: string;
    composition?: string;
    packSize: number;
    packUnit: string;
    requiresPrescription?: boolean;
    batchNo: string;
    expiryDate: string;
    scheduleType: DrugSchedule;
    mrp: number;
    rate: number;
    qtyStrips: number;
    qtyLoose: number;
    totalQty: number;
    saleMode: SaleMode;
    discountPct: number;
    gstRate: number;
    taxableAmount: number;
    gstAmount: number;
    totalAmount: number;
}

export interface PaymentSplit {
    method: PaymentMode;
    amount: number;
    cashTendered?: number;
    cashReturned?: number;
    upiRef?: string;
    cardLast4?: string;
    cardType?: string;
    creditGiven?: number;
    splitBreakdown?: {
        cash: number;
        upi: number;
        card: number;
        credit: number;
    };
}

export interface BillTotals {
    subtotal: number;
    discountAmount: number;
    taxableAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    roundOff: number;
    grandTotal: number;
    amountPaid: number;
    amountDue: number;
    itemCount: number;
    totalQty: number;
    hasScheduleH: boolean;
    requiresDoctorDetails: boolean;
}

export interface ScheduleHData {
    patientName: string;
    patientAge: number;
    patientAddress: string;
    doctorName: string;
    doctorRegNo: string;
    prescriptionNo: string;
}

export interface SaleInvoice {
    id: string;
    outletId: string;
    invoiceNo: string;
    invoiceDate: string;
    customerId?: string;
    customer?: Customer;
    doctorId?: string;
    subtotal: number;
    discountAmount: number;
    taxableAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    roundOff: number;
    grandTotal: number;
    paymentMode: PaymentMode;
    cashPaid: number;
    upiPaid: number;
    cardPaid: number;
    creditGiven: number;
    amountPaid: number;
    amountDue: number;
    isReturn: boolean;
    billedBy: string;
    billedByName: string;
    items: CartItem[];
    createdAt: string;
}

export interface CreditAccount {
    id: string;
    customerId: string;
    customer: Customer;
    outletId: string;
    creditLimit: number;
    totalOutstanding: number;
    totalBorrowed: number;
    totalRepaid: number;
    status: 'active' | 'partial' | 'cleared' | 'overdue';
    lastTransactionDate?: string;
    createdAt: string;
}

export interface CreditTransaction {
    id: string;
    creditAccountId: string;
    customerId: string;
    invoiceId?: string;
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    balanceAfter: number;
    recordedBy: string;
    createdAt: string;
}

export interface Distributor {
    id: string;
    outletId: string;
    name: string;
    gstin?: string;
    drugLicenseNo?: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    creditDays: number;
    openingBalance?: number;
    balanceType?: 'CR' | 'DR';
    isActive: boolean;
}

export interface PurchaseInvoice {
    id: string;
    outletId: string;
    distributorId: string;
    distributor: Distributor;
    invoiceNo: string;
    invoiceDate: string;
    dueDate?: string;
    subtotal: number;
    discountAmount: number;
    taxableAmount: number;
    gstAmount: number;
    grandTotal: number;
    amountPaid: number;
    outstanding: number;
    createdAt: string;
}

export interface AttendanceRecord {
    id: string;
    staffId: string;
    staff: StaffMember;
    outletId: string;
    date: string;
    checkInTime?: string;
    checkInPhotoUrl?: string;
    checkOutTime?: string;
    checkOutPhotoUrl?: string;
    workingHours?: number;
    status: AttendanceStatus;
}

export interface DashboardKPI {
    date: string;
    totalSales: number;
    totalBills: number;
    cashCollected: number;
    upiCollected: number;
    cardCollected: number;
    creditGiven: number;
    totalDiscount: number;
    totalGst: number;
    topSellingItems: {
        name: string;
        qty: number;
        revenue: number;
    }[];
    staffLeaderboard: {
        staffId: string;
        id?: string; // App aliasing fallback
        name: string;
        role?: StaffRole; // From Stage 5 map
        avatarUrl?: string;
        billsCount: number;
        totalSales: number;
    }[];
    hourlySales: {
        hour: string;
        bills: number;
        sales: number;
    }[];
    paymentBreakdown: {
        cash: number;
        upi: number;
        card: number;
        credit: number;
    };
}

export interface DashboardAlerts {
    lowStock: {
        batch: { productName: string; batchNumber: string; expiryDate: string };
        currentStock: number;
        reorderLevel: number;
    }[];
    expiringSoon: {
        batch: { productName: string; batchNumber: string; expiryDate: string };
        daysUntilExpiry: number;
    }[];
    overdueAccounts: {
        customerId: string;
        customerName: string;
        outstandingAmount: number;
        daysOverdue: number;
    }[];
}

export interface StockFilters {
    search?: string;
    scheduleType?: DrugSchedule | 'all';
    lowStock?: boolean;
    expiringSoon?: boolean;
    category?: string;
    manufacturer?: string;
    sortBy?: 'name' | 'stock' | 'expiry' | 'mrp';
    sortOrder?: 'asc' | 'desc';
}

export interface StockAdjustmentPayload {
    batchId: string;
    adjustmentType: 'damage' | 'theft' | 'correction' | 'return_from_patient';
    qtyChange: number;
    reason: string;
    adjustedBy: string;
}

export interface ExpiryReportItem {
    product: MasterProduct;
    batch: Batch;
    daysRemaining: number;
}

export interface PurchaseItem {
    id: string;
    purchaseId: string;
    masterProductId: string;
    product?: MasterProduct;
    batchNo: string;
    expiryDate: string;
    qty: number;
    freeQty: number;
    purchaseRate: number;
    discountPct: number;
    gstRate: number;
    mrp: number;
    saleRate: number;
    taxableAmount: number;
    gstAmount: number;
    totalAmount: number;
}

export interface PurchaseInvoiceFull extends PurchaseInvoice {
    items: PurchaseItem[];
    createdByName: string;
}

export interface PurchaseFormItem {
    masterProductId: string;
    productName: string; // for display only
    batchNo: string;
    expiryDate: string;
    qty: number;
    freeQty: number;
    purchaseRate: number;
    discountPct: number;
    gstRate: number;
    mrp: number;
    saleRate: number;
    taxableAmount: number;
    gstAmount: number;
    totalAmount: number;
}

export interface CreatePurchasePayload {
    outletId: string;
    distributorId: string;
    invoiceNo: string;
    invoiceDate: string;
    dueDate?: string;
    notes?: string;
    items: Omit<PurchaseFormItem, 'productName'>[];
}

export interface DistributorLedgerEntry {
    id: string;
    date: string;
    type: 'purchase' | 'payment';
    invoiceNo: string;
    amount: number;
    balanceAfter: number;
    description: string;
}

export type CreditStatus = 'active' | 'partial' | 'cleared' | 'overdue';
export type AgingBucket = 'current' | '30-60' | '60-90' | 'over90';

export interface CreditAgingSummary {
    current: { count: number; amount: number };
    days30to60: { count: number; amount: number };
    days60to90: { count: number; amount: number };
    over90: { count: number; amount: number };
    totalOverdue: { count: number; amount: number };
    totalOutstanding: { count: number; amount: number };
}

export interface RecordCreditPaymentPayload {
    amount: number;
    mode: PaymentMode;
    reference?: string;
    notes?: string;
    paymentDate: string;
}

export interface RegularMedicine {
    productId: string;
    name: string;
    qty: number;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
}

export interface CustomerFull extends Customer {
    bloodGroup?: string;
    allergies: string[];
    chronicConditions: string[];
    preferredDoctorId?: string;
    preferredDoctor?: Doctor;
    regularMedicines: RegularMedicine[];
    lastRefillDate?: string;
    nextRefillDue?: string;
    totalVisits: number;
    notes?: string;
}

export interface CustomerPurchaseSummary {
    invoiceId: string;
    date: string;
    total: number;
    items: number;
    billedBy: string;
    paymentMode: PaymentMode;
}

export interface CustomerFilters {
    search?: string;
    isChronic?: boolean;
    hasOutstanding?: boolean;
    sortBy?: 'name' | 'totalPurchases' | 'lastVisit' | 'outstanding' | 'nextRefill';
    sortOrder?: 'asc' | 'desc';
}

export interface RefillAlert {
    customer: CustomerFull;
    medicines: RegularMedicine[];
    daysOverdue: number;
    nextRefillDue: string;
}
