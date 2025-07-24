import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubCategory } from "./update-sub-category";
import { useSubCategoryInterface } from "@/interfaces/use-sub-category-interface";

export function useUpdateSubCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: {id_subcategory: number, name_subcategory: string, id_category: number})=>{
            return await updateSubCategory(data);
        },
        onMutate(data){
            return data;
        },
        onSuccess(data, _variables, context) {
            if(data.erro) return;

            queryClient.setQueryData<useSubCategoryInterface[]>(["sub_category"], prev=>{
                if(!prev) return [context];

                return prev.map((subcategory)=>{
                    if(subcategory.id_subcategory === context.id_subcategory)
                        return {...subcategory, name_subcategory: context.name_subcategory, id_subcategory: context.id_category}

                    return subcategory;
                })
            })
        },

    });
}