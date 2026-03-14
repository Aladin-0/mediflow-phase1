import {
    mockAuthApi,
    mockProductsApi,
    mockSalesApi,
    mockCreditApi,
    mockDashboardApi,
    mockStaffApi,
    mockInventoryApi,
    mockPurchasesApi,
    mockDistributorsApi,
    mockCustomersApi
} from './mockApi';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// Temporary placeholders for real API implementation until backend is ready
const realAuthApi: typeof mockAuthApi = {} as any;
const realProductsApi: typeof mockProductsApi = {} as any;
const realSalesApi: typeof mockSalesApi = {} as any;
const realCreditApi: typeof mockCreditApi = {} as any;
const realDashboardApi: typeof mockDashboardApi = {} as any;
const realStaffApi: typeof mockStaffApi = {} as any;
const realInventoryApi: typeof mockInventoryApi = {} as any;
const realPurchasesApi: typeof mockPurchasesApi = {} as any;
const realDistributorsApi: typeof mockDistributorsApi = {} as any;
const realCustomersApi: typeof mockCustomersApi = {} as any;

export const authApi = USE_MOCK ? mockAuthApi : realAuthApi;
export const productsApi = USE_MOCK ? mockProductsApi : realProductsApi;
export const salesApi = USE_MOCK ? mockSalesApi : realSalesApi;
export const creditApi = USE_MOCK ? mockCreditApi : realCreditApi;
export const dashboardApi = USE_MOCK ? mockDashboardApi : realDashboardApi;
export const staffApi = USE_MOCK ? mockStaffApi : realStaffApi;
export const inventoryApi = USE_MOCK ? mockInventoryApi : realInventoryApi;
export const purchasesApi = USE_MOCK ? mockPurchasesApi : realPurchasesApi;
export const distributorsApi = USE_MOCK ? mockDistributorsApi : realDistributorsApi;
export const customersApi = USE_MOCK ? mockCustomersApi : realCustomersApi;
