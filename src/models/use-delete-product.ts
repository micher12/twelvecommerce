import { useProductInterface } from "@/interfaces/use-product-interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { deleteProduct } from "./delete-product";
import { ReadonlyURLSearchParams } from "next/navigation";

type realDataProps = {
    product: useProductInterface,
    name_category: string,
    name_subcategory: string,
}


export function useDeleteProduct(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(variables: { data: number | Row<realDataProps>[]; params: ReadonlyURLSearchParams | null })=>{
            const params = variables.params;
            let page = 1;
            let limit = 10;

            if(params?.has("page") && params?.has("limit")){
               page = Number(params.get("page"));
               limit = Number(params.get("limit"));
            }

            const res = await deleteProduct(variables.data);

            return {res, page, limit};
        },
        onSuccess({limit, page, res}){ 
            if(!res.sucesso) return;

            queryClient.setQueryData<useProductInterface[]>(["products", undefined, undefined, page, limit], (prev)=>{
                if(!prev) return []

                const ids = new Set(res.dataIds);

                const newData = prev.filter((product)=> !ids.has(product.id_product));

                return newData;
            })
        },
    });
}