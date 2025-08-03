import { VariationChange } from "@/interfaces/modified-attributes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "./update-product";

interface updateProps {
    id: number
    changes: {
        key: string;
        newValue: string;
    }[]
    variations: VariationChange[]
}

export function useUpdateProduct(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: updateProps)=>{
            const res = await updateProduct(data);

            return res;
        },
        onMutate(data){
            return data;
        },
        onSuccess(data, _variables, context) {
            if(data?.sucesso){
                queryClient.invalidateQueries({queryKey: ["single-product", context.id]});
                queryClient.refetchQueries({queryKey: ["products", undefined, undefined]});
            }
        },
    })
}