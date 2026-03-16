import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { GSTSummary, Outlet } from '@/types';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        padding: 40,
        color: '#0f172a',
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2pt solid #0f172a',
        paddingBottom: 12,
    },
    outletName: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
    },
    outletAddress: {
        fontSize: 9,
        color: '#475569',
        marginBottom: 2,
    },
    gstin: {
        fontSize: 9,
        color: '#475569',
        marginBottom: 8,
    },
    reportTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        marginTop: 6,
        marginBottom: 2,
    },
    period: {
        fontSize: 9,
        color: '#64748b',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
        color: '#0f172a',
        borderBottom: '1pt solid #e2e8f0',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    cell: {
        flex: 1,
        fontSize: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0f172a',
        padding: 6,
        marginBottom: 0,
    },
    th: {
        flex: 1,
        color: '#ffffff',
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 6,
        borderBottom: '0.5pt solid #e2e8f0',
    },
    evenRow: {
        backgroundColor: '#f1f5f9',
    },
    td: {
        flex: 1,
        fontSize: 9,
        color: '#334155',
    },
    totalsRow: {
        flexDirection: 'row',
        backgroundColor: '#0f172a',
        padding: 6,
        marginTop: 2,
    },
    tdBold: {
        flex: 1,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#ffffff',
    },
    footer: {
        marginTop: 30,
        borderTop: '1pt solid #e2e8f0',
        paddingTop: 8,
        fontSize: 8,
        color: '#94a3b8',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    slabRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    slabCell: {
        width: '30%',
        fontSize: 10,
    },
    slabValue: {
        width: '35%',
        fontSize: 10,
        textAlign: 'right',
    },
});

interface GSTReportPDFProps {
    summary: GSTSummary;
    outlet: Outlet;
}

export function GSTReportPDF({ summary, outlet }: GSTReportPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.outletName}>{outlet.name}</Text>
                    <Text style={styles.outletAddress}>
                        {outlet.address}, {outlet.city}, {outlet.state} - {outlet.pincode}
                    </Text>
                    <Text style={styles.gstin}>GSTIN: {outlet.gstin}</Text>
                    <Text style={styles.reportTitle}>GSTR-1 Summary Report</Text>
                    <Text style={styles.period}>
                        Period: {summary.period.from} to {summary.period.to}
                    </Text>
                </View>

                {/* GST Slab Breakup */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>GST Slab-wise Summary</Text>
                    <View style={styles.row}>
                        <Text style={[styles.slabCell, { fontFamily: 'Helvetica-Bold' }]}>GST Rate</Text>
                        <Text style={[styles.slabValue, { fontFamily: 'Helvetica-Bold' }]}>Taxable Amount</Text>
                        <Text style={[styles.slabValue, { fontFamily: 'Helvetica-Bold' }]}>Tax Amount</Text>
                    </View>
                    {summary.gstSlabBreakup.map(slab => (
                        <View style={styles.slabRow} key={slab.rate}>
                            <Text style={styles.slabCell}>{slab.rate}% GST</Text>
                            <Text style={styles.slabValue}>₹{slab.taxableAmount.toFixed(2)}</Text>
                            <Text style={styles.slabValue}>₹{slab.taxAmount.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* HSN-wise Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>HSN-wise Details</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.th}>HSN Code</Text>
                        <Text style={[styles.th, { flex: 2 }]}>Products</Text>
                        <Text style={styles.th}>Taxable Amt</Text>
                        <Text style={styles.th}>CGST</Text>
                        <Text style={styles.th}>SGST</Text>
                        <Text style={styles.th}>Total Tax</Text>
                    </View>
                    {summary.rows.map((row, i) => (
                        <View
                            style={[styles.tableRow, i % 2 === 0 ? styles.evenRow : {}]}
                            key={`${row.hsnCode}-${i}`}
                        >
                            <Text style={styles.td}>{row.hsnCode}</Text>
                            <Text style={[styles.td, { flex: 2 }]}>{row.productName}</Text>
                            <Text style={styles.td}>₹{row.taxableAmount.toFixed(2)}</Text>
                            <Text style={styles.td}>₹{row.cgstAmount.toFixed(2)}</Text>
                            <Text style={styles.td}>₹{row.sgstAmount.toFixed(2)}</Text>
                            <Text style={styles.td}>₹{row.totalTax.toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.totalsRow}>
                        <Text style={styles.tdBold}>TOTAL</Text>
                        <Text style={[styles.tdBold, { flex: 2 }]}></Text>
                        <Text style={styles.tdBold}>₹{summary.totals.taxableAmount.toFixed(2)}</Text>
                        <Text style={styles.tdBold}>₹{summary.totals.cgstAmount.toFixed(2)}</Text>
                        <Text style={styles.tdBold}>₹{summary.totals.sgstAmount.toFixed(2)}</Text>
                        <Text style={styles.tdBold}>₹{summary.totals.totalTax.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated on {format(new Date(), 'dd MMM yyyy, hh:mm a')}</Text>
                    <Text>This is a computer-generated report.</Text>
                </View>
            </Page>
        </Document>
    );
}
