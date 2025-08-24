import { useMutation } from "@tanstack/react-query";
import { insertImagesProduct } from "./insert-images-product";

interface dataProps{
    urls: string[], 
    id_product: number
}

export function useInsertImagesProduct(){

    return useMutation({
        mutationFn: async (data: dataProps)=>{
            const res = insertImagesProduct(data.urls, data.id_product);

            return res;
        }
    });
}