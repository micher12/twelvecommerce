"use client";

import { getCategorys } from "@/api/get-categorys";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/DataTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useDeleteCategory } from "@/models/use-delete-category";
import { useQuery } from "@tanstack/react-query"
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";



export function ListCategory(){

    const { mutateAsync: deleteCategory } = useDeleteCategory();
    const { setAlert } = useGetAuthContext() as UseAuthContextProps;

    const { data } = useQuery({
        queryKey: ["category"],
        queryFn: getCategorys,
    })

    async function handleDeleteCategory(rows: Row<useCategoryInterface>[] | number){

        const idsToDelete: number[] = [];

        if(typeof rows === "number"){
            idsToDelete.push(rows);
        }

        if (Array.isArray(rows)) {
            for (const row of rows) {
                idsToDelete.push(row.original.id_category);
            }
        }

        const result = await Promise.allSettled(
            idsToDelete.map(id=> deleteCategory(id))
        )

        const erros = result
        .filter(r => r.status === "fulfilled" && r.value.erro);

        if(erros.length > 0){
           return setAlert("erro", "Erro ao excluir uma ou mais categorias");
        }

        setAlert("sucesso", "Categoria excluída com sucesso!");
    }

    const columns: ColumnDef<useCategoryInterface>[] = [
        {
            id: "select",
            header: ({table})=>(
                <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() || 
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Selecionar tudo"
                />
            ),
            cell: ({row})=>(
                <Checkbox 
                checked={row.getIsSelected()}
                onCheckedChange={(value)=> row.toggleSelected(!!value)}
                aria-label="Linha selecionada"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id_category",
            header: ({ column })=>{
                return(
                    <Button 
                    variant={"ghost"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID
                        <ArrowUpDown />
                    </Button>
                )
            },
        },
        {
            accessorKey: "name_category",
            header: ({ column })=>{
                return(
                    <Button 
                    variant={"ghost"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Categoria
                        <ArrowUpDown />
                    </Button>
                )
            },
        },
        {
            id: "actions",
            header: ()=> (<div className="text-right">Ação</div>),
            cell: ({table, row})=>{
                
                return(
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} className="h-8 w-8 p-0">
                                    <span className="sr-only">Ação</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="text-zinc-500">Ação</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/category/edit_category?id=${row.original.id_category}`}>Editar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="bg-red-500/50 hover:bg-red-600/50 text-white w-full h-8 justify-start!">Exlcuir</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Você tem certeza desta ação?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Ao excluir, não poderá desfazer está ação!<br/>
                                                {table.getIsSomeRowsSelected() 
                                                ? <>Todos os {table.getSelectedRowModel().rows.length} item(s) <b>selecionados</b> serão excluídos.</> 
                                                : table.getIsAllRowsSelected() 
                                                ? <b>Todos os items serão excluídos!</b>
                                                : <>Apenas o item atual será excluído.</>
                                                }
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancelar
                                            </AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <DropdownMenuItem asChild>
                                                    <Button onClick={()=>{
                                                        if(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())
                                                            handleDeleteCategory(table.getSelectedRowModel().rows)
                                                        else
                                                            handleDeleteCategory(row.original.id_category)
                                                    }} className="bg-red-500/50 hover:bg-red-600/50! focus:bg-red-500/50 text-white cursor-pointer" >Excluir</Button>
                                                </DropdownMenuItem>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ]


    return(
        <div className="pt-5">
            <h2 className="text-3xl font-bold">Categorias cadastradas: </h2>
            {data && <DataTable columns={columns} data={data} className="mt-5" />}
        </div>
    )
}