import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "./update-category";

export function useUpdateCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: useCategoryInterface)=>{
            return await updateCategory(data);
        },
        onMutate(data){
            return data;
        },
        onSuccess(data, _variables, context) {
            if(data.erro) return;

            queryClient.setQueryData<useCategoryInterface[]>(["category"], prev=>{
                if(!prev) return [context];

                return prev.map((category)=>{
                    if(category.id_category === context.id_category)
                        return {id_category: context.id_category, name_category: context.name_category}

                    return category;
                })
            })
        },

    });
}