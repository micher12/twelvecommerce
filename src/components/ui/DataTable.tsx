"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import React from "react";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableColumnFilter } from "./DataTableColumnFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    className?: string
    classNameTable?: string
    page?: number;
    maxPage?: number;
    pageSize?: number;
    limit?: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    className,
    classNameTable,
    page = 0,
    maxPage = 1,
    limit = 10,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        pageCount: maxPage,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: { 
            sorting,
            columnFilters,
            pagination:{
                pageIndex: page,
                pageSize: limit,
            },
        },
    })

    return (
        <>
        <DataTableColumnFilter table={table} />

        <DataTableViewOptions table={table} />
        
        <div className={`overflow-hidden rounded-md border ${className}`}>
            <Table className={`${classNameTable}`}>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
        <DataTablePagination table={table} className="mt-5" />
        </>
    )
}