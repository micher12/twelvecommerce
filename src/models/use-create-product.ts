import { useProductInterface } from "@/interfaces/use-product-interface";
import { useVariationInterface } from "@/interfaces/use-variation-interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "./create-product";


interface dataProps{
    product: useProductInterface;
    variations: useVariationInterface[];
}

export function useCreateProduct(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: dataProps)=>{
            const res = await createProduct(data);

            return res;
        },
        onMutate(data){
            return data;
        },
        onSuccess(data, _variables, context) {
            if(!data.sucesso) return;

            queryClient.setQueryData<useProductInterface[]>(["products", undefined, undefined, 1, 10], (prev) => {
                if(!prev) return [{...context.product, id_product: data.id_product}];
                
                const oldData = [{...context.product, id_product: data.id_product}, ...prev]

                return oldData;
            });

        },
    });
}