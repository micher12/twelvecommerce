"use server";

import { getCategorys } from "@/api/get-categorys";
import { getProducts } from "@/api/get-products";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { ListProducts } from "@/components/(admin)/products/list-products";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/getQueryClient";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PageProps {
    searchParams: Promise<{
        category?: string;
        subcategory?: string;
    }>;
}

export default async function Products({searchParams}: PageProps){

    const { category, subcategory } = await searchParams;

    const fetchProduct = async ()=>{
        const res = await getProducts({category, subcategory});

        if(res.sucesso)
            return res.products;

        return null;
    }

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
        queryKey: ["products", category, subcategory],
        queryFn: fetchProduct
    })

    queryClient.prefetchQuery({
        queryKey: ["category"],
        queryFn: fetchCategory,
    })

    queryClient.prefetchQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory,
    })

    return(
        <div>
            <Button asChild className="cursor-pointer ">
                <Link href={"/admin/products/new"} ><Plus/> Cadastrar novo produto</Link>
            </Button>
            <h2 className="text-3xl font-bold mt-5">Produtos cadastrados:</h2>
            
            <ListProducts searchParams={{category, subcategory}} />
        </div>
    )
}