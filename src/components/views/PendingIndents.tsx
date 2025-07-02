import { ListTodo } from 'lucide-react';
import Heading from '../element/Heading';
import { useSheets } from '@/context/SheetsContext';
import { useEffect, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import DataTable from '../element/DataTable';

interface PendingIndentsData {
    date: string;
    indentNo: string;
    product: string;
    quantity: number;
    rate: number;
    uom: string;
    vendorName: string;
    paymentTerm: string;
    specifications: string;
}

export default () => {
    const { indentSheet, indentLoading } = useSheets();

    const [tableData, setTableData] = useState<PendingIndentsData[]>([]);

    // Fetching table data
    useEffect(() => {
        setTableData(
            indentSheet
                .filter((sheet) => sheet.planned4 !== '' && sheet.actual4 === '')
                .map((sheet) => ({
                    date: formatDate(new Date(sheet.timestamp)),
                    indentNo: sheet.indentNumber,
                    product: sheet.productName,
                    quantity: sheet.approvedQuantity,
                    rate: sheet.approvedRate,
                    uom: sheet.uom,
                    vendorName: sheet.approvedVendorName,
                    paymentTerm: sheet.approvedPaymentTerm,
                    specifications: sheet.specifications || '',
                }))
        );
    }, [indentSheet]);

    // Creating table columns
    const columns: ColumnDef<PendingIndentsData>[] = [
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'indentNo', header: 'Indent Number' },
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
        { accessorKey: 'vendorName', header: 'Vendor Name' },
        { accessorKey: 'paymentTerm', header: 'Payment Term' },
        { accessorKey: 'specifications', header: 'Specifications' },
    ];

    return (
        <div>
                <Heading heading="Pending POs" subtext="View pending purchase orders">
                    <ListTodo size={50} className="text-primary" />
                </Heading>
                    <DataTable
                        data={tableData}
                        columns={columns}
                        searchFields={['product', 'vendorName', 'paymentTerm', 'specifications']}
                        dataLoading={indentLoading}
                    />
        </div>
    );
};
