import { VariationChange } from "@/interfaces/modified-attributes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "./update-product";
import { ReadonlyURLSearchParams } from "next/navigation";

interface updateProps {
    id: number
    changes: {
        key: string;
        newValue: string;
    }[]
    variations: VariationChange[]
    params: ReadonlyURLSearchParams | null;
}

export function useUpdateProduct(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: updateProps)=>{
            const params = data.params;
            let limit = 10;
            let page = 1;

            if(params?.has("page") && params?.has("limit")){
                limit = Number(params.get("limit"));
                page = Number(params.get("page"));
            }

            const res = await updateProduct(data);

            return {res, page, limit};
        },
        onSuccess({res, limit, page}) {
            if(res.sucesso){
                queryClient.refetchQueries({queryKey: ["products", undefined, undefined, page, limit]});
            }
        },
    })
}