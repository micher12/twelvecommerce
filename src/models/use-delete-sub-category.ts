import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSubCategoryInterface } from "@/interfaces/use-sub-category-interface";
import { deleteSubCategory } from "./delete-sub-category";

export function useDeleteSubCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(id_subcategory: number)=>{
            return await deleteSubCategory(id_subcategory);
        },
        onMutate(data){return data},
        onSuccess(data, _variables, id_subcategory) {
            if(data.erro) return;

            queryClient.setQueryData<useSubCategoryInterface[]>(["sub_category"], (prev)=>{
                if(!prev) return [];

                return prev.filter(val => val.id_subcategory !== id_subcategory);
            })

        },
    })
}