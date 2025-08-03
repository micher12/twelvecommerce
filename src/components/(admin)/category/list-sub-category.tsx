"use client";

import { getCategorys } from "@/api/get-categorys";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { AlertDialog, AlertDialogHeader, AlertDialogCancel, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/DataTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,  } from "@/components/ui/dropdown-menu";
import { SkeletonComponent } from "@/components/ui/skeleton-componet";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { useSubCategoryInterface } from "@/interfaces/use-sub-category-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useDeleteSubCategory } from "@/models/use-delete-sub-category";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

interface subCategoryTable {
    subcategory: useSubCategoryInterface | undefined,
    category: useCategoryInterface | undefined
}

export function ListSubCategory(){

    const fetchSubCategory = async ()=>{
        const res = await getSubCategorys();

        if(res.sucesso)
            return res.res

        return null;
    }

    const { mutateAsync: deleteSubCategory } = useDeleteSubCategory();
    const { setAlert } = useGetAuthContext() as UseAuthContextProps;

    const { data: categorys } = useQuery({
        queryKey: ["category"],
        queryFn: getCategorys
    })

    const { data: subCategorys } = useQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory
    })

    const realData: subCategoryTable[] = (subCategorys ?? []).map((sub)=>{
        const category  = categorys?.find(val => val.id_category === sub.id_category);
        return {
            subcategory: sub,
            category: category
        }
    })

    async function handleDeleteSubCategory(rows: number | Row<subCategoryTable>[]){
        const idsToDelete: number[] = [];

        if(typeof rows === "number"){
            idsToDelete.push(rows);
        }

        if (Array.isArray(rows)) {
            for (const row of rows) {
                idsToDelete.push(Number(row.original.subcategory?.id_subcategory));
            }
        }

        const result = await Promise.allSettled(
            idsToDelete.map(id=> deleteSubCategory(id))
        )

        const erros = result
        .filter(r => r.status === "fulfilled" && r.value.erro);

        if(erros.length > 0){
           return setAlert("erro", "Erro ao excluir uma ou mais categorias");
        }

        setAlert("sucesso", "Categoria excluída com sucesso!");

    }

    const columns: ColumnDef<subCategoryTable>[] = [
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
            accessorKey: "subcategory.name_subcategory",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                name="Sub Categoria"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sub Categoria
                    <ArrowUpDown />
                </Button>
            )
        },
        {
            accessorKey: "category.name_category",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                name="Categoria"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Categoria
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({row})=>(
                <div className="bg-slate-50 text-zinc-900 font-semibold rounded-md w-fit p-0.5 px-2">{row.original.category?.name_category}</div>
            )
        },
        {
            id: "action",
            header: ()=> <div className="text-end">Ação</div>,
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
                                    <Link href={`/admin/category/sub_category/edit_subcategory?id=${row.original.subcategory?.id_subcategory}`}>Editar</Link>
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
                                                            handleDeleteSubCategory(table.getSelectedRowModel().rows)
                                                        else
                                                            handleDeleteSubCategory(Number(row.original.subcategory?.id_subcategory))
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
        <div>
            <Button asChild>
                <Link href={"/admin/category/sub_category/new_subcategory"}><Plus /> Cadastrar Sub Categoria</Link>
            </Button>
            <h2 className="text-3xl font-bold mt-5">Sub Categorias: </h2>

            {categorys && subCategorys ? (
                <DataTable columns={columns} data={realData} className="mt-5" />
            )
            : <SkeletonComponent type={"data_table"} />
            }
          
        </div>
    )
}