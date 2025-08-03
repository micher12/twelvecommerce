import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import type { Table } from "@tanstack/react-table"

interface DataTableColumnFilterProps<TData> {
    table: Table<TData>
}

export function DataTableColumnFilter<TData>({ table }: DataTableColumnFilterProps<TData>) {
    const filterableColumns = table
        .getAllColumns()
        .filter((col) => col.getCanFilter() && !col.id.toLowerCase().startsWith("id") && !col.id.toLowerCase().includes("star"))

    const [selectedColumn, setSelectedColumn] = useState(() => {
        return filterableColumns[0]?.id || ""
    })

    const [filterValue, setFilterValue] = useState("")

   useEffect(() => {
        table.setColumnFilters((prev) => {
            const otherFilters = prev.filter((f) => f.id !== selectedColumn)
            if (filterValue.trim() === "") return otherFilters

            const column = table.getColumn(selectedColumn)
            const columnType = (column?.columnDef?.meta as { type?: string })?.type

            let parsedValue: unknown = filterValue

            if (columnType === "number") {
                const numeric = Number(filterValue)
                if (isNaN(numeric)) return otherFilters
                    parsedValue = numeric
            }

            if (selectedColumnType === "date") {

                const date = new Date(filterValue)
                if (isNaN(date.getTime())) return otherFilters

                parsedValue = filterValue // mantém no formato yyyy-MM-dd
            }

            return [...otherFilters, { id: selectedColumn, value: parsedValue }]
        })
    }, [selectedColumn, filterValue, table])


    function extractTextFromHeader(header: unknown, id: string): string {
        if (typeof header === "string") return header

        if (React.isValidElement(header)) {
            const props = header.props as { name?: string }
            if (props?.name) return props.name
        }

        if (typeof header === "function") {
            try {
                const rendered = header({ column: { id } })

                if (React.isValidElement(rendered)) {
                    const props = rendered.props as { name?: string }
                    if (props?.name) return props.name
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

    const selectedColumnDef = filterableColumns.find((col) => col.id === selectedColumn)
    const selectedColumnLabel = extractTextFromHeader(selectedColumnDef?.columnDef.header, selectedColumn)
    const selectedColumnType = (selectedColumnDef?.columnDef?.meta as { type?: string } | undefined)?.type

    return (
        <div className="flex items-center gap-3 mt-4">
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione a coluna" />
                </SelectTrigger>
                <SelectContent>
                    {filterableColumns.map((col) => (
                        <SelectItem key={col.id} value={col.id}>
                            {extractTextFromHeader(col.columnDef.header, col.id)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                className="w-full no-spinner"
                placeholder={`Filtrar por ${selectedColumnLabel}`}
                type={
                    selectedColumnType === "number" ? "number" :
                    selectedColumnType === "boolean" ? "boolean" :
                    selectedColumnType === "date" ? "date" : "text"
                }
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
            />
        </div>
    )
}
