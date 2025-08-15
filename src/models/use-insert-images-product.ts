import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertImagesProduct } from "./insert-images-product";
import { useProductInterface } from "@/interfaces/use-product-interface";

interface dataProps{
    urls: string[], 
    id_product: number
}

export function useInsertImagesProduct(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: dataProps)=>{
            const res = insertImagesProduct(data.urls, data.id_product);

            return res;
        },
        onMutate(data){
            return data.id_product;
        },
        onSuccess(data,_,id_product){
            if(data.sucesso) {
                const urls = data.urls;

                queryClient.setQueryData<useProductInterface[]>(["products", undefined, undefined], (prev)=>{
                    if(!prev) return prev;

                    return prev.map((item)=>{
                        if(item.id_product === id_product)
                            return {...item, urls}

                        return item;
                    })
                })
            }
        }
    });
}