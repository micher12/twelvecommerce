import { getCategorys } from "@/api/get-categorys";
import { CreateSubCategory } from "@/components/(admin)/category/create-sub-category";
import { getQueryClient } from "@/lib/getQueryClient";

export default function NewSubCategoryPage(){

    const queryCleint = getQueryClient();

    queryCleint.prefetchQuery({
        queryKey: ["category"],
        queryFn: getCategorys
    })

    return(
        <CreateSubCategory />
    )
}