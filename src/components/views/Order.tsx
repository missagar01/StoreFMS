import { Package2 } from 'lucide-react';
import Heading from '../element/Heading';
import { useSheets } from '@/context/SheetsContext';
import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import DataTable from '../element/DataTable';


interface HistoryData {
    indentDate: string;
    date: string;
    indentNo: string;
    poNumber: string;
    product: string;
    quantity: number;
    rate: number;
    uom: string;
    poCopy: string;
}

export default () => {
    const { indentSheet, indentLoading } = useSheets();

    const [historyData, setHistoryData] = useState<HistoryData[]>([]);

    // Fetching table data
    useEffect(() => {
        setHistoryData(
            indentSheet
                .filter((sheet) => sheet.planned4 !== '' && sheet.actual4 !== '')
                .map((sheet) => ({
                    indentDate: formatDate(new Date(sheet.timestamp)),
                    date: formatDate(new Date(sheet.actual4)),
                    indentNo: sheet.indentNumber,
                    poNumber: sheet.poNumber,
                    product: sheet.productName,
                    quantity: sheet.approvedQuantity,
                    rate: sheet.approvedRate,
                    uom: sheet.uom,
                    poCopy: sheet.poCopy,
                }))
        );
    }, [indentSheet]);

    // Creating table columns
    const historyColumns: ColumnDef<HistoryData>[] = [
        { accessorKey: 'indentDate', header: 'Indent Date' },
        { accessorKey: 'date', header: 'PO Date' },
        { accessorKey: 'indentNo', header: 'Indent No.' },
        { accessorKey: 'poNumber', header: 'PO Number' },
        { accessorKey: 'product', header: 'Product' },
        { accessorKey: 'quantity', header: 'Quantity' },
        {
            accessorKey: 'rate',
            header: 'Rate',
            cell: ({ row }) => {
                return <>&#8377;{row.original.rate}</>;
            },
        },
        { accessorKey: 'uom', header: 'UOM' },
        {
            accessorKey: 'poCopy',
            header: 'PO Copy',
            cell: ({ row }) => {
                const attachment = row.original.poCopy;
                return attachment ? (
                    <a href={attachment} target="_blank">
                        PDF
                    </a>
                ) : (
                    <></>
                );
            },
        },
    ];

    return (
        <div>
                <Heading heading="Orders" subtext="View purchase orders" tabs>
                    <Package2 size={50} className="text-primary" />
                </Heading>
                
                    <DataTable
                        data={historyData}
                        columns={historyColumns}
                        searchFields={['product', 'poNumber']}
                        dataLoading={indentLoading}
                    />
        </div>
    );
};
