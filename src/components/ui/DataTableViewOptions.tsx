import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import type { Table } from "@tanstack/react-table"

function extractTextFromHeader(header: unknown, id: string): string {
    if (typeof header === "string") return header

    if (
        React.isValidElement(header) &&
        typeof header.props === "object" &&
        header.props &&
        "name" in header.props
    ) {
        return header.props.name as string
    }

    if (typeof header === "function") {
        try {
            const rendered = header({ column: { id } })
            if (
                React.isValidElement(rendered) &&
                typeof rendered.props === "object" &&
                rendered.props &&
                "name" in rendered.props
            ) {
                return rendered.props.name as string
            }

            const staticMarkup = renderToStaticMarkup(rendered)
            const tempDiv = document.createElement("div")
            tempDiv.innerHTML = staticMarkup
            return tempDiv.textContent?.trim() || id
        } catch {
            return id
        }
    }

    return id
}

export function DataTableViewOptions<TData>({ table }: { table: Table<TData> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-5 hidden h-8 lg:flex"
                >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Colunas
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
                <DropdownMenuLabel>Colunas Ativas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {extractTextFromHeader(column.columnDef.header, column.id)}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
