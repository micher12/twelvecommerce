"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useUpdateCategory } from "@/models/use-update-category";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export function EditCategory(){

    const params = useSearchParams();
    
    const id = Number(params?.get("id"));

    const { mutateAsync: updateAddress } = useUpdateCategory();
    const { setAlert } = useGetAuthContext() as UseAuthContextProps;

    const queryClient = useQueryClient();

    const data = queryClient.getQueryData<useCategoryInterface[]>(["category"]);

    const preValue = data?.filter(item => {
            if(item.id_category === id)
                return item;
        })[0];

    const [value, setValue] = useState<useCategoryInterface | null>(preValue ?? null);


    async function handleUpdateCategory(data: useCategoryInterface){
        const res = await updateAddress(data);

        if(res.erro)
            return setAlert("erro", res.erro);

        setAlert("sucesso", "Categoria atualizado com sucesso!");
    }

    return(
        
        <div>
            {value ? (
                <>
                <Input value={value.name_category} onChange={(e)=> setValue(prev => prev ? ({...prev, name_category: e.target.value}) : prev )} />
                <Button onClick={()=>handleUpdateCategory(value)} className="mt-5 cursor-pointer">Atualizar</Button>
                </>
            )
            : <h2>Categoria não encontrada!</h2>
            }
        </div>
        
    )
}