"use client";

import { getCategorys } from "@/api/get-categorys";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useUpdateSubCategory } from "@/models/use-update-sub-category";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

export function EditSubCategory(){

    const params = useSearchParams();

    const fetchSubCategory = async()=>{
        const res = await getSubCategorys();

        if(res.sucesso)
            return res.res;

        return null;
    }

    const { setAlert } = useGetAuthContext() as UseAuthContextProps;
    const {mutateAsync: updateSubCategory } = useUpdateSubCategory();

    const id = Number(params?.get("id"));

    const { data: categorys } = useQuery({
        queryKey: ["category"],
        queryFn: getCategorys,
    })

    const { data } = useQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory,
    })

    const preSubCategory = data?.filter(item => {
        if(item.id_subcategory === id)
            return item;
    })[0];

    const preCategory = categorys?.filter(item => item.id_category === preSubCategory?.id_category)[0];

    const [categoria, setCategoria] = useState(preCategory?.id_category);
    const [subCategoria, setSubCategoria] = useState(preSubCategory?.name_subcategory);

    async function handleUpdateSubCategory(){
        if(!categoria || !subCategoria) return;

        const res = await updateSubCategory({id_category: categoria, id_subcategory: id, name_subcategory: subCategoria})

        if(res.erro)
            return setAlert("erro", res.erro);

        setAlert("sucesso", "Atualizado com sucesso!");

    }

    useEffect(()=>{ 
        if(!preSubCategory || !preCategory) return

        setSubCategoria(preSubCategory.name_subcategory);
        setCategoria(preCategory.id_category);

    },[preSubCategory, preCategory])

    return(
        <div>
            {(categoria && categorys) && (
                <>
                    <Select 
                     value={categoria?.toString()}
                     onValueChange={(e)=>setCategoria(Number(e.valueOf()))} 
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Categoria..." defaultValue={categoria} >{categorys.find(val => val.id_category === categoria)?.name_category}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {categorys.map((category)=>(
                                    <SelectItem key={category.id_category} value={category.id_category.toString()} >{category.name_category}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Input className="mt-5" value={subCategoria} onChange={(e)=>setSubCategoria(e.target.value)} placeholder="Sub Categoria..." />

                    <Button className="mt-5 cursor-pointer"
                    onClick={handleUpdateSubCategory}
                    >Atualizar</Button>
                </>
            )}
        </div>
    )
}