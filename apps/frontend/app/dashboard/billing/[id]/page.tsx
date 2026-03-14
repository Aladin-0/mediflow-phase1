'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { ArrowLeft, Printer, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { salesApi } from '@/lib/apiClient';
import { InvoicePreview } from '@/components/billing/InvoicePreview';
import { InvoiceThermal } from '@/components/billing/InvoiceThermal';
import { usePrintInvoice } from '@/hooks/usePrintInvoice';
import { useSettingsStore } from '@/store/settingsStore';

export default function PastInvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { printerType } = useSettingsStore();
    const invoiceId = params.id as string;

    const printRef = useRef<HTMLDivElement>(null);
    const { handlePrint } = usePrintInvoice(printRef);
    const isThermal = printerType.startsWith('thermal');

    const { data: invoice, isLoading, isError } = useQuery({
        queryKey: ['invoice', invoiceId],
        queryFn: () => salesApi.getById(invoiceId),
        retry: 1,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-r-transparent animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Invoice Details...</p>
            </div>
        );
    }

    if (isError || !invoice) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h2 className="text-xl font-bold text-slate-800">Invoice Not Found</h2>
                <p className="text-slate-500">The requested invoice ID: {invoiceId} might be invalid or deleted.</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 text-slate-500 mb-1 hover:text-slate-900">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-xl font-bold text-slate-900 shrink-0">Past Invoice: {invoice.invoiceNo}</h1>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => window.open(`whatsapp://send?text=Please find your invoice ${invoice.invoiceNo} attached.`)}>
                        <MessageCircle className="w-4 h-4 mr-2 text-green-600" /> WhatsApp
                    </Button>
                    <Button className="flex-1 sm:flex-none" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" /> Reprint Bill
                    </Button>
                </div>
            </div>

            {/* Invoice Container */}
            <div className={`mx-auto bg-white shadow-md border border-slate-200 rounded-xl overflow-hidden py-4 ${isThermal ? 'w-[80mm] box-content' : ''}`}>
                <div className="flex items-center justify-between px-6 py-2 bg-slate-50 border-b border-slate-200 mb-6 text-sm">
                    <span className="font-semibold text-slate-600">Generated Using {isThermal ? 'Thermal Layout' : 'A4 Layout'}</span>
                    <span className="text-slate-400">Settings &rarr; Printer: {printerType}</span>
                </div>
                
                {isThermal ? (
                    <InvoiceThermal ref={printRef} invoice={invoice} />
                ) : (
                    <InvoicePreview ref={printRef} invoice={invoice} />
                )}
            </div>
        </div>
    );
}
