import { useProductInterface } from "@/interfaces/use-product-interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { deleteProduct } from "./delete-product";

type realDataProps = {
    product: useProductInterface,
    name_category: string,
    name_subcategory: string,
}


export function useDeleteProduct(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: number | Row<realDataProps>[])=>{
            const res = await deleteProduct(data);

            return res;
        },
        onSuccess(data) {
            if(!data.sucesso) return;

            queryClient.setQueryData<useProductInterface[]>(["products", undefined, undefined], (prev)=>{
                if(!prev) return []

                const ids = new Set(data.dataIds);

                const newData = prev.filter((product)=> !ids.has(product.id_product));

                return newData;
            })

        },
    });
}