import { format } from 'date-fns';

export function exportToCSV(
    data: object[],
    filename: string,
    columns: { key: string; label: string }[]
): void {
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
        columns.map(c => {
            const val = (row as Record<string, unknown>)[c.key];
            // Escape commas in values
            return typeof val === 'string' && val.includes(',')
                ? `"${val}"`
                : String(val ?? '');
        }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
