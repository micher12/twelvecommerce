import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "./delete-category";
import { useCategoryInterface } from "@/interfaces/use-category-interface";

export function useDeleteCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id_category: number)=>{
            return await deleteCategory(id_category);
        },
        onMutate: (id_category) => {return id_category},
        onSuccess(data, _variables, context) {
            if(data.erro) return;

            queryClient.setQueryData<useCategoryInterface[]>(["category"], (prev)=>{
                if(!prev) return [];

                return prev.filter(category => category.id_category !== context);;
            })
        },
    })
}