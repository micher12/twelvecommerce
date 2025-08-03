
import { getCategorys } from "@/api/get-categorys";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { FormCreateProduct } from "@/components/(admin)/products/form-create-product";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default function NewProductPage(){

    const fetchCategory = async ()=>{
        return await getCategorys();
    }

    const fetchSubCategory = async ()=>{
        const res = await getSubCategorys();

        if(res.sucesso)
            return res.res;

        return null;
    }

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: ["category"],
        queryFn: fetchCategory,
    })

    queryClient.prefetchQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory,
    })

    return(
        <>
            <h2 className="text-3xl font-bold">Novo produto: </h2>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <FormCreateProduct />
            </HydrationBoundary>
        </>
    )
} 