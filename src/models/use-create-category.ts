import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { createCategory } from "@/models/create-category";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: useCategoryInterface)=>{
            const res = await createCategory(data);

            return res;
        },
        onMutate(data){
            const oldData = queryClient.getQueryData<useCategoryInterface[]>(["category"]) ?? []

            return { newData: data, oldData }
        },
        onSuccess(data, _variables, context) {
            if(!data.sucesso) return;

            queryClient.setQueryData<useCategoryInterface[]>(["category"], prev => {
                if(!prev) return [{id_category: data.id_category, name_category: context.newData.name_category}]

                const newData: useCategoryInterface = {
                    id_category: data.id_category, 
                    name_category: context.newData.name_category
                }

                const mix: useCategoryInterface[] = [newData, ...context.oldData]
                const orded = mix.sort((a,b) => a.name_category.localeCompare(b.name_category));

                return orded;
            })
        },
    })

}