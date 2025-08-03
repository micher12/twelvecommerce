"use client";

import { getCategorys } from "@/api/get-categorys";
import { getProducts } from "@/api/get-products";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/DataTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SkeletonComponent } from "@/components/ui/skeleton-componet";
import { StarCheckbox } from "@/components/ui/star-checkbox";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useProductInterface } from "@/interfaces/use-product-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useDeleteProduct } from "@/models/use-delete-product";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface PageProps {
    searchParams: {
        category?: string;
        subcategory?: string;
    };
}

type realDataProps = {
    product: useProductInterface,
    name_category: string,
    name_subcategory: string,
}

export function ListProducts({searchParams}: PageProps){

    const { category, subcategory } = searchParams;

    const { setAlert} = useGetAuthContext() as UseAuthContextProps;
    const { mutateAsync: deleteProduct } = useDeleteProduct();

    const fetchProduct = async ()=>{
        const res = await getProducts({category, subcategory});

        if(res.sucesso)
            return res.products

        return null;
    }

    const fetchCategory = async ()=>{
        return await getCategorys();
    }

    const fetchSubCategory = async ()=>{
        const res = await getSubCategorys();

        if(res.sucesso)
            return res.res;

        return null;
    }

    const { data: products } = useQuery({
        queryKey: ["products", category, subcategory],
        queryFn: fetchProduct,
    })

    const { data: categoryData } = useQuery({
        queryKey: ["category"],
        queryFn: fetchCategory,
    })

    const { data: subCategoryData } = useQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory,
    })

    if(!products || !categoryData || !subCategoryData)
        return <SkeletonComponent type={"data_table"} />

    const realData: realDataProps[] = products.map(product => {
        return {
            product: product,
            name_category: categoryData.find(prev => prev.id_category === product.id_category)?.name_category ?? "",
            name_subcategory: subCategoryData.find(prev => prev.id_subcategory === product.id_subcategory)?.name_subcategory ?? "",
        }
    });

    async function handleDeleteProduct(data: number | Row<realDataProps>[]){
        const res = await deleteProduct(data);
        
        if(res.erro)
            return setAlert("erro", res.erro);

        setAlert("sucesso", "Produto excluído com sucesso!");

    }

    const columns: ColumnDef<realDataProps>[] = [
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
            accessorKey: "product.name_product",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                onClick={()=>{
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}
                >
                    Produto
                    <ArrowUpDown />
                </Button>
            )
        },
        {
            accessorKey: "product.price_product",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                onClick={()=>{
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}
                >
                    Preço base
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({row})=>(
                <div>{(row.original.product.price_product).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            ),
            meta: { type: "number" },
            filterFn: "includesString",
        },
        {
            accessorKey: "name_category",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                onClick={()=>{
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}
                >
                    Categoria
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({row})=> {
                const name = row.original.name_category;

                return <div className="rounded-lg bg-slate-50 font-semibold text-zinc-900 w-fit py-0.5 px-2">{name}</div>

            }
        },
        {
            accessorKey: "name_subcategory",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                onClick={()=>{
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}
                >
                    Sub Categoria
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({row})=> {
                const name = row.original.name_subcategory !== "" ? row.original.name_subcategory : "Nenhuma";

                return <div className="rounded-lg bg-slate-50 font-semibold text-zinc-900 w-fit py-0.5 px-2">{name}</div>

            }
        },
        {
            accessorKey: "product.star_product",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                onClick={()=>{
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}
                >
                    Star
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({row})=>(
                <StarCheckbox checked={row.original.product.star_product == "true" ? true: false} />
            ),
            filterFn: "equals",
        },
        {
            accessorKey: "product.createdat",
            header: ({column})=>(
                <Button
                variant={"ghost"}
                onClick={()=>{
                    column.toggleSorting(column.getIsSorted() === "asc")
                }}
                >
                    Data
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({row})=>(
                <div>{new Date(row.original.product.createdat).toLocaleDateString("pt-br")}</div>
            ),
            meta: {type: "date"},
            filterFn: "includesString"
        },
        {
            id: "action",
            header: ()=> (<div className="text-right">Ação</div>),
            cell: ({table, row})=>{
                return(
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <div className="text-right">
                                <Button variant={"ghost"} className="h-8 w-8 p-0">
                                    <span className="sr-only">Ação</span>
                                    <MoreHorizontal />
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-zinc-500">Ação</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/edit_product?id=${row.original.product.id_product}`} >Editar</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                     
                                        <Button className="w-full h-8 bg-red-500/50 hover:bg-red-600/50! focus:bg-red-500/50 text-white">Exlcuir</Button>
                                        
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir produto: </AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogDescription>
                                            Ao excluir, não poderá desfazer está ação!<br/>
                                            {table.getIsSomeRowsSelected() 
                                            ? <>Todos os {table.getSelectedRowModel().rows.length} item(s) <b>selecionados</b> serão excluídos.</> 
                                            : table.getIsAllRowsSelected() 
                                            ? <b>Todos os items serão excluídos!</b>
                                            : <>Apenas o item atual será excluído.</>
                                            }
                                        </AlertDialogDescription>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel> Cancelar </AlertDialogCancel>
                                            <AlertDialogAction asChild> 
                                                <DropdownMenuItem asChild>
                                                    <Button 
                                                    onClick={()=>{
                                                        if(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())
                                                            handleDeleteProduct(table.getSelectedRowModel().rows)
                                                        else
                                                            handleDeleteProduct(Number(row.original.product.id_product))
                                                    }}
                                                    className="bg-red-500/50 hover:bg-red-600/50! focus:bg-red-500/50 text-white cursor-pointer"
                                                    >
                                                        Excluir
                                                    </Button>
                                                </DropdownMenuItem>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    return(
        <div className="mt-5">
            {realData && <DataTable  columns={columns} data={realData} className="mt-5" />}
        </div>
    )
}