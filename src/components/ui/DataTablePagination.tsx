"use client";

import { Table } from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    className?: string;
}


export function DataTablePagination<TData>({
    table,
    className,
}: DataTablePaginationProps<TData>) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams?.get("page");
    const limit = searchParams?.get("limit");

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between px-2 ${className}`}>
            <div className="text-muted-foreground flex-1 text-sm">
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} linha(s).
            </div>
            <div className="flex justify-between gap-5 xs:gap-8 flex-wrap xs:flex-nowrap sm:items-center space-x-6 lg:space-x-8">
                <div className="flex flex-1/1 items-center justify-end xs:justify-start space-x-2 mr-0">
                    <p className="text-sm font-medium">Itens por página</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            const url = `?page=${page ?? 1}&limit=${value}`
                            router.push(url);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-8 flex-1/1 justify-end">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="hidden size-8 lg:flex"
                            onClick={() => {
                                table.setPageIndex(0)

                                const url = `?page=${1}&limit=${limit ?? 10}`
                                router.push(url);
                            }}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                                table.previousPage();

                                const index = table.getState().pagination.pageIndex;

                                const url = `?page=${index}&limit=${limit ?? 10}`
                                router.push(url);
                                
                            }}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                                table.nextPage()

                                const index = table.getState().pagination.pageIndex+2;

                                const url = `?page=${index}&limit=${limit ?? 10}`
                                router.push(url);
                            }}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="hidden size-8 lg:flex"
                            onClick={() => {
                                table.setPageIndex(table.getPageCount() - 1)

                                const url = `?page=${table.getPageCount()}}&limit=${limit ?? 10}`
                                router.push(url);
                            }}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
