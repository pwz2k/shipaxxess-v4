import React, { useState } from 'react';
import { useTable, useSortBy, Column, CellProps, Row } from 'react-table';
import { CSVLink } from "react-csv";
import { Button } from "@client/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { JSX } from 'react/jsx-runtime';

interface Data {
    transactionId: string;
    date: string;
    total: number;
    amount: number;
    balance: number;
    description: string;
    type: string;
    status: string;
}

interface TransactionHistoryTableProps {
    data: Data[];
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ data }) => {
    const columns: Column<Data>[] = React.useMemo(
        () => [
            {
                Header: 'Date',
                accessor: 'date',
            },
            {
                Header: 'Amount',
                accessor: 'amount',
            },
            {
                Header: 'Balance',
                accessor: 'balance',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Status',
                accessor: 'status',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    // Pagination state
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0);

    const paginatedData = React.useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return rows.slice(start, end);
    }, [pageIndex, pageSize, rows]);

    const totalPages = Math.ceil(rows.length / pageSize);

    return (
        <div className="mx-auto">
            <h2 className="text-2xl font-bold mb-2">Transaction History</h2>
            <div className='py-2 flex items-center justify-between'>
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <Button variant="secondary">
                    <CSVLink data={data} filename={"transaction-history.csv"} className="">
                        Export Data
                    </CSVLink>
                </Button>
            </div>
            <div className="overflow-x-auto">
                <div className="max-h-96 h-96 overflow-y-auto">
                    <table {...getTableProps()} className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-800">
                            {headerGroups.map((headerGroup: { getHeaderGroupProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; headers: { getHeaderProps: (arg0: any) => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableHeaderCellElement> & React.ThHTMLAttributes<HTMLTableHeaderCellElement>; getSortByToggleProps: () => { (): any; new(): any; onClick: React.MouseEventHandler<SVGSVGElement> | undefined; }; render: (arg0: string) => string | number | boolean | React.ReactPortal | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }[]; }) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column: { getHeaderProps: (arg0: any) => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableHeaderCellElement> & React.ThHTMLAttributes<HTMLTableHeaderCellElement>; getSortByToggleProps: () => { (): any; new(): any; onClick: React.MouseEventHandler<SVGSVGElement> | undefined; }; render: (arg0: string) => string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-2 px-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase">
                                            <div className="flex items-center">
                                                {column.render('Header')}
                                                <ArrowUpDown
                                                    className="w-4 h-4 ml-2 cursor-pointer"
                                                    onClick={column.getSortByToggleProps().onClick}
                                                />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className="text-gray-700 h-full">
                            {paginatedData.map((row: { getRowProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>; cells: any[]; }) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} className="border-b border-gray-200 hover:bg-gray-100">
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} className="py-3 px-4 text-left whitespace-nowrap">
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            {paginatedData.length < pageSize && (
                                <tr>
                                    <td colSpan={columns.length} className="py-3 px-4 text-left whitespace-nowrap">
                                        <div className="h-full"></div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="py-2 flex justify-around items-center">
                    <div>
                        <Button variant="outline" disabled={pageIndex === 0} onClick={() => setPageIndex(pageIndex - 1)}>
                            Previous
                        </Button>
                    </div>
                    <div>
                        <span>
                            Page {pageIndex + 1} of {totalPages}
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPageIndex(0); // Reset to first page when page size changes
                            }}
                            className="ml-2 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                        >
                            {[10, 20, 50, 100].map(size => (
                                <option key={size} value={size}>
                                    Show {size} rows
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Button variant="outline" disabled={pageIndex >= totalPages - 1} onClick={() => setPageIndex(pageIndex + 1)}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionHistoryTable;
