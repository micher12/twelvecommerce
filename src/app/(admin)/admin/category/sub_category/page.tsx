import { getCategorys } from "@/api/get-categorys";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { ListSubCategory } from "@/components/(admin)/category/list-sub-category";
import { getQueryClient } from "@/lib/getQueryClient";

export default function SubCategoryPage(){

    const fetchSubCategory = async ()=>{
        const res = await getSubCategorys();

        if(res.sucesso)
            return res.res

        return null;
    }

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: ["category"],
        queryFn: getCategorys
    })

    queryClient.prefetchQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory
    })

    return(
        <ListSubCategory />
    )
}