import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubCategory } from "./create-sub-category";
import { useSubCategoryInterface } from "@/interfaces/use-sub-category-interface";

export function useCreateSubCategory(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(data: {name_subcategory: string, id_category: number})=>{
            const res = await createSubCategory(data);

            return res;
        },
        onMutate(data){return data},
        onSuccess(data, _variables, newData) {
            if(!data.sucesso) return;

            queryClient.setQueryData<useSubCategoryInterface[]>(["sub_category"], (prev)=>{
                if(!prev) return [{ ...newData, id_subcategory: data.id_subcategory }];

                const mix = [{...newData, id_subcategory: data.id_subcategory}, ...prev];

                const orded = mix.sort((a,b)=> a.name_subcategory.localeCompare(b.name_subcategory));

                return orded;
            })

        },
    })
}