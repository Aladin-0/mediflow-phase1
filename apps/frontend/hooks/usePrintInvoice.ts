'use client';

import { useSettingsStore } from '@/store/settingsStore';
import { useReactToPrint } from 'react-to-print';

function getPrintPageStyle(type: 'a4' | 'thermal_80mm' | 'thermal_57mm'): string {
    if (type === 'a4') {
        return `
            @page { size: A4; margin: 10mm; }
            @media print {
                body { -webkit-print-color-adjust: exact; }
            }
        `;
    }
    if (type === 'thermal_80mm') {
        return `
            @page { size: 80mm auto; margin: 2mm; }
            @media print { 
                body { 
                    font-size: 11px; 
                    -webkit-print-color-adjust: exact; 
                } 
            }
        `;
    }
    // thermal_57mm
    return `
        @page { size: 57mm auto; margin: 1mm; }
        @media print { 
            body { 
                font-size: 10px; 
                -webkit-print-color-adjust: exact; 
            } 
        }
    `;
}

export function usePrintInvoice(contentRef: React.RefObject<HTMLDivElement>) {
    const { printerType } = useSettingsStore();

    const handlePrintFn = useReactToPrint({
        content: () => contentRef.current,
        pageStyle: getPrintPageStyle(printerType as 'a4' | 'thermal_80mm' | 'thermal_57mm'),
        onBeforePrint: () => {
            console.log('Preparing to print...');
            return Promise.resolve();
        },
        onAfterPrint: () => console.log('Print job fired.'),
    });

    // useReactToPrint returns a function that might return a Promise,
    // but the hook consumer expects `() => void`
    const handlePrint = () => {
        handlePrintFn();
    };

    return { handlePrint };
}
