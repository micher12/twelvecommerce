"use server";

import { getSingleProduct } from "@/api/get-single-product";
import { EditProduct } from "@/components/(admin)/products/edit-product";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
    searchParams: Promise<{
        id?: string
    }>;
}

export default async function EditProductPage({ searchParams }: PageProps){


    const queryClient = getQueryClient();

    const { id } = await searchParams;

    if(!id)
        return <h2>É preciso de um ID válido!</h2>

    const fetchSingleProduct = async()=>{
        const res = await getSingleProduct({id_product: Number(id)});

        if(res.sucesso) return res.product;

        return null;
    }

    queryClient.prefetchQuery({
        queryKey: ["single-product", id],
        queryFn: fetchSingleProduct,
    })

    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EditProduct id={Number(id)} />
        </HydrationBoundary>
    )
}