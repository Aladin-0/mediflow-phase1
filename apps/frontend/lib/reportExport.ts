import { format } from 'date-fns';
import {
    SalesReportRow,
    GSTSummary,
    StockValuationRow,
    ExpiryReportRow,
    StaffReportRow,
    PurchaseReportRow,
    DateRangeFilter,
} from '@/types';

function downloadCSV(headers: string[], rows: (string | number)[][], filename: string): void {
    const csvHeaders = headers.join(',');
    const csvRows = rows.map(row =>
        row.map(val => {
            const str = String(val ?? '');
            return str.includes(',') ? `"${str}"` : str;
        }).join(',')
    );
    const csv = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportSalesReportCSV(rows: SalesReportRow[], dateRange: DateRangeFilter): void {
    const headers = [
        'Date', 'Invoices', 'Total Sales', 'Discount', 'GST',
        'Net Sales', 'Cash', 'UPI', 'Card', 'Credit',
    ];
    const csvRows = rows.map(r => [
        r.date, r.invoiceCount, r.totalSales, r.totalDiscount,
        r.totalTax, r.netSales, r.cashSales, r.upiSales,
        r.cardSales, r.creditSales,
    ]);
    downloadCSV(headers, csvRows, `sales-report-${dateRange.from}-to-${dateRange.to}.csv`);
}

export function exportGSTReportCSV(summary: GSTSummary): void {
    const headers = [
        'HSN Code', 'Product', 'Taxable Amount',
        'CGST Rate%', 'CGST Amount', 'SGST Rate%', 'SGST Amount', 'Total Tax',
    ];
    const rows = summary.rows.map(r => [
        r.hsnCode, r.productName, r.taxableAmount,
        r.cgstRate, r.cgstAmount, r.sgstRate, r.sgstAmount, r.totalTax,
    ]);
    downloadCSV(headers, rows, `gst-report-${summary.period.from}.csv`);
}

export function exportStockValuationCSV(rows: StockValuationRow[]): void {
    const headers = [
        'Product', 'Composition', 'Batch', 'Expiry', 'Qty (Strips)',
        'Purchase Rate', 'MRP', 'Sale Rate', 'Stock Value', 'MRP Value',
    ];
    const csvRows = rows.map(r => [
        r.productName, r.composition, r.batchNo, r.expiryDate, r.qtyStrips,
        r.purchaseRate, r.mrp, r.saleRate, r.stockValue, r.mrpValue,
    ]);
    downloadCSV(headers, csvRows, `stock-valuation-${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

export function exportExpiryReportCSV(rows: ExpiryReportRow[]): void {
    const headers = [
        'Product', 'Batch No', 'Expiry Date', 'Days Remaining',
        'Qty (Strips)', 'MRP', 'Stock Value', 'Distributor',
    ];
    const csvRows = rows.map(r => [
        r.productName, r.batchNo, r.expiryDate, r.daysRemaining,
        r.qtyStrips, r.mrp, r.stockValue, r.distributorName,
    ]);
    downloadCSV(headers, csvRows, `expiry-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

export function exportStaffReportCSV(rows: StaffReportRow[], dateRange: DateRangeFilter): void {
    const headers = [
        'Staff Name', 'Role', 'Bills', 'Total Sales', 'Avg Bill Value',
        'Total Discount', 'Avg Discount%', 'Cash Bills', 'Credit Bills',
    ];
    const csvRows = rows.map(r => [
        r.staffName, r.role, r.billsCount, r.totalSales, r.avgBillValue,
        r.totalDiscount, r.avgDiscountPct, r.cashBills, r.creditBills,
    ]);
    downloadCSV(headers, csvRows, `staff-report-${dateRange.from}-to-${dateRange.to}.csv`);
}

export function exportPurchaseReportCSV(rows: PurchaseReportRow[], dateRange: DateRangeFilter): void {
    const headers = [
        'Date', 'Invoice No', 'Distributor', 'Items',
        'Subtotal', 'Tax', 'Grand Total', 'Paid', 'Outstanding',
    ];
    const csvRows = rows.map(r => [
        r.date, r.invoiceNo, r.distributorName, r.itemCount,
        r.subtotal, r.taxAmount, r.grandTotal, r.amountPaid, r.outstanding,
    ]);
    downloadCSV(headers, csvRows, `purchase-report-${dateRange.from}-to-${dateRange.to}.csv`);
}
