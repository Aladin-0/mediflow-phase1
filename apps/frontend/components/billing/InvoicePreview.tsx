'use client';

import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { SaleInvoice } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface InvoicePreviewProps {
    invoice: SaleInvoice;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(({ invoice }, ref) => {
    const { outlet, user } = useAuthStore();
    
    // In a real scenario, this would come from an API or customer relation
    // For mock/MVP, checking direct payload references if they existed
    const customerStr = invoice.customerId ? `Customer ID: ${invoice.customerId}` : 'Walk-in Customer';

    return (
        <div ref={ref} className="bg-white text-slate-900 w-[210mm] max-w-full mx-auto p-8 font-sans text-sm print:shadow-none print:m-0 print:w-[210mm] shadow relative">
            
            {/* --- HEADER --- */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    {outlet?.logoUrl ? (
                         /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={outlet.logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-2" />
                    ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded mb-2 flex items-center justify-center text-xs font-bold text-slate-500">LOGO</div>
                    )}
                    <h1 className="text-xl font-bold uppercase tracking-wider">{outlet?.name || 'MediFlow Pharmacy'}</h1>
                    <p className="text-xs text-slate-600 mt-1 max-w-[250px]">
                        {outlet?.address || '123 Health Street, Medical District'}<br />
                        {outlet?.city || 'City'}, {outlet?.state || 'State'} {outlet?.pincode || '000000'}
                    </p>
                    <div className="text-xs mt-2 text-slate-600 border-l-2 border-slate-300 pl-2">
                        <p><span className="font-semibold text-slate-500">Ph:</span> {outlet?.phone || '+91 0000000000'}</p>
                        <p><span className="font-semibold text-slate-500">GSTIN:</span> {outlet?.gstin || '27XXXXX0000X1ZX'}</p>
                        <p><span className="font-semibold text-slate-500">D.L No:</span> {outlet?.drugLicenseNo || 'MH-MZ4-111111'}</p>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end">
                    <h2 className="text-2xl font-bold text-primary tracking-widest border border-primary px-3 py-1 bg-primary/5 uppercase mb-4">Tax Invoice</h2>
                    
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-left w-64 bg-slate-50 p-3 rounded">
                        <span className="font-semibold text-slate-500">Invoice No:</span>
                        <span className="font-mono font-bold text-slate-900 text-right">{invoice.invoiceNo}</span>
                        
                        <span className="font-semibold text-slate-500">Date:</span>
                        <span className="text-right">{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</span>
                        
                        <span className="font-semibold text-slate-500">Time:</span>
                        <span className="text-right">{format(new Date(invoice.createdAt), 'hh:mm a')}</span>
                    </div>

                    <div className="mt-4 text-left w-64">
                        <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1">Billed To:</p>
                        <p className="font-semibold">{customerStr}</p>
                        {/* {invoice.doctor && <p className="text-xs mt-1 text-slate-600">Prescribed by: {invoice.doctor}</p>} */}
                    </div>
                </div>
            </div>

            <div className="w-full h-0.5 bg-slate-900 mt-6 md:mt-8 mix-blend-multiply"></div>

            {/* --- ITEMS TABLE --- */}
            <table className="w-full mt-4 text-xs">
                <thead>
                    <tr className="bg-slate-900 text-white font-medium uppercase tracking-wider text-left border-b-2 border-slate-900">
                        <th className="py-2 px-2 w-8 text-center">#</th>
                        <th className="py-2 px-2">Item Name</th>
                        <th className="py-2 px-2 w-20">Batch</th>
                        <th className="py-2 px-2 w-24">Expiry</th>
                        <th className="py-2 px-2 w-16 text-right">Qty</th>
                        <th className="py-2 px-2 w-20 text-right">Rate</th>
                        <th className="py-2 px-2 w-16 text-right">Disc%</th>
                        <th className="py-2 px-2 w-16 text-right">GST%</th>
                        <th className="py-2 px-2 w-24 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                         <tr key={index} className="border-b border-slate-100 last:border-slate-300">
                            <td className="py-2 px-2 text-center text-slate-500">{index + 1}</td>
                            <td className="py-2 px-2 font-medium">{item.productId || `Item ${index + 1}`}</td>
                            <td className="py-2 px-2 text-slate-600 uppercase font-mono">{item.batchId?.slice(0, 6) || 'BATCH'}</td>
                            <td className="py-2 px-2 text-slate-600 font-mono">12/26</td>
                            <td className="py-2 px-2 text-right">
                                {item.qtyStrips > 0 ? `${item.qtyStrips}S ` : ''}
                                {item.qtyLoose > 0 ? `${item.qtyLoose}L` : ''}
                            </td>
                            <td className="py-2 px-2 text-right">₹{item.rate.toFixed(2)}</td>
                            <td className="py-2 px-2 text-right text-slate-500">{item.discountPct}%</td>
                            <td className="py-2 px-2 text-right text-slate-500">{item.gstRate}%</td>
                            <td className="py-2 px-2 text-right font-medium">
                                ₹{((item.qtyStrips + item.qtyLoose) * item.rate * (1 - item.discountPct / 100)).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- TOTALS AREA --- */}
            <div className="flex justify-between mt-4 items-start">
                
                {/* GST Breakup Table (Left) */}
                <div className="w-[300px]">
                    <div className="border border-slate-300 rounded overflow-hidden mt-6">
                        <table className="w-full text-[10px] text-slate-600 text-center">
                            <thead className="bg-slate-100 border-b border-slate-300">
                                <tr>
                                    <th className="py-1 px-1 font-semibold border-r border-slate-300">GST %</th>
                                    <th className="py-1 px-1 font-semibold border-r border-slate-300">Taxable</th>
                                    <th className="py-1 px-1 font-semibold border-r border-slate-300">CGST</th>
                                    <th className="py-1 px-1 font-semibold">SGST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Loop generic breakdown based on the static subtotal for now */}
                                <tr className="border-b border-slate-200">
                                    <td className="py-1 px-1 border-r border-slate-200">12%</td>
                                    <td className="py-1 px-1 border-r border-slate-200">₹{invoice.taxableAmount.toFixed(2)}</td>
                                    <td className="py-1 px-1 border-r border-slate-200">₹{invoice.cgst.toFixed(2)}</td>
                                    <td className="py-1 px-1">₹{invoice.sgst.toFixed(2)}</td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-50 font-bold border-t border-slate-300 text-slate-800">
                                <tr>
                                    <td className="py-1 px-1 border-r border-slate-300 text-right pr-2" colSpan={2}>Total Tax:</td>
                                    <td className="py-1 px-1 border-r border-slate-300">₹{invoice.cgst.toFixed(2)}</td>
                                    <td className="py-1 px-1">₹{invoice.sgst.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Subtotals Area (Right) */}
                <table className="w-72 text-sm text-right">
                    <tbody>
                        <tr className="text-slate-600">
                            <td className="py-1 pr-6 uppercase tracking-wider text-xs">Subtotal</td>
                            <td className="py-1">₹{invoice.subtotal.toFixed(2)}</td>
                        </tr>
                        {invoice.discountAmount > 0 && (
                            <tr className="text-green-600">
                                <td className="py-1 pr-6 uppercase tracking-wider text-xs">Total Discount</td>
                                <td className="py-1">-₹{invoice.discountAmount.toFixed(2)}</td>
                            </tr>
                        )}
                        <tr className="text-slate-600">
                            <td className="py-1 pr-6 uppercase tracking-wider text-xs">Taxable Value</td>
                            <td className="py-1">₹{invoice.taxableAmount.toFixed(2)}</td>
                        </tr>
                        <tr className="text-slate-600">
                            <td className="py-1 pr-6 uppercase tracking-wider text-xs">CGST + SGST</td>
                            <td className="py-1">+₹{(invoice.cgst + invoice.sgst).toFixed(2)}</td>
                        </tr>
                        {invoice.roundOff !== 0 && (
                            <tr className="text-slate-600">
                                <td className="py-1 pr-6 uppercase tracking-wider text-xs">Round Off</td>
                                <td className="py-1">{invoice.roundOff > 0 ? '+' : ''}₹{invoice.roundOff.toFixed(2)}</td>
                            </tr>
                        )}
                        <tr className="border-t-2 border-slate-900">
                            <td className="py-3 pr-6 font-bold uppercase tracking-wider text-lg text-slate-900">Grand Total</td>
                            <td className="py-3 font-bold text-xl text-slate-900">₹{invoice.grandTotal.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* --- PAYMENT METHOD --- */}
            <div className="flex border-t border-slate-300 mt-6 pt-4 text-xs font-semibold uppercase tracking-wider">
                <div className="flex-1 text-slate-600">
                    Payment Method: <span className="text-slate-900 font-bold ml-1">{invoice.paymentMode}</span>
                </div>
                <div className="text-right flex items-center gap-4">
                    <span>Amount Paid: <br className="hidden" /><span className="text-slate-900 font-bold ml-1">₹{invoice.amountPaid.toFixed(2)}</span></span>
                    {invoice.amountPaid > invoice.grandTotal && (
                        <span>Change Returned: <br className="hidden" /><span className="text-green-700 font-bold ml-1">₹{(invoice.amountPaid - invoice.grandTotal).toFixed(2)}</span></span>
                    )}
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="mt-12 pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-end">
                <div>
                    <p>Billed by: <span className="font-semibold text-slate-700">{user?.name || 'Staff Member'}</span></p>
                    <p className="mt-1 text-[10px]">This is a computer-generated invoice and requires no signature.</p>
                </div>
                
                <div className="text-center font-medium italic text-slate-400 pb-2">
                    {outlet?.invoiceFooter || 'Thank you for your purchase! Get well soon.'}
                </div>

                <div className="w-20 h-20 border border-slate-200 flex flex-col items-center justify-center p-1 bg-slate-50">
                    <span className="text-[8px] font-bold text-slate-400 text-center">SCAN TO<br/>VERIFY</span>
                    {/* Placeholder for QR Code */}
                    <div className="w-10 h-10 border-2 border-slate-300 border-dashed mt-1"></div>
                </div>
            </div>
            
        </div>
    );
});
InvoicePreview.displayName = 'InvoicePreview';
