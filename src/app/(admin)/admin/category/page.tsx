import { getCategorys } from "@/api/get-categorys";
import { ListCategory } from "@/components/(admin)/category/list-category";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/getQueryClient";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Category(){

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: ["category"],
        queryFn: getCategorys
    })

    return (
        <>
        <Button asChild>
            <Link href={"/admin/category/new_category"} ><Plus/>Cadastrar categoria</Link>
        </Button>
        <ListCategory />
        </>
    )
}