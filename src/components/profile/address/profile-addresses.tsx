"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAddressInterface } from "@/interfaces/use-address-interface";
import { Card, CardContent, CardDescription, CardHeader } from "../../ui/card";
import { EditAddress } from "./edit-address";
import { SkeletonComponent } from "@/components/ui/skeleton-componet";
import { RemoveAddress } from "./remove-address";
import { CreateNewAddress } from "./create-new-address";
import { useState } from "react";

export function ProfileAddressComponent(){

    const [deleteing, setDeleting] = useState<{state: boolean, id: null | number}>({state: false, id: null});

    const addressFetch = async ()=>{
        const res: {sucesso?: "ok", address?: useAddressInterface[], erro?: string} = await fetch("/api/profile/address").then(res => res.json());
        
        if(res.sucesso)
            return res.address

        return null;
    }


    const { data: enderecos, isLoading: loadingEnderecos } = useQuery({
        queryKey: ["user", "user-address"],  
        queryFn: addressFetch,
        placeholderData: keepPreviousData
    })

 
    return(
        <div className="flex flex-col">
            
            <CreateNewAddress />
            <h2 className="text-lg font-semibold my-4">Endereços cadastrados: </h2>
            {!loadingEnderecos ?
            <div className="flex w-full gap-8 flex-wrap">
                {enderecos?.map((endereco,index)=>(
                    <Card key={endereco.id_address} className={`bg-zinc-700/50 shadow-lg rounded-lg! w-full 2md:w-[calc((100%/2)-16px)]! 2lg:w-[calc((100%/3)-21.4px)]! gap-1 
                    ${(deleteing.state && deleteing.id === endereco.id_address) && "animate-pulse bg-zinc-500/50"}`} >
                        <CardHeader>
                            <CardDescription className="flex justify-between items-center ">
                                {`${index+1}° Endereço`} 
                                <div className="flex items-center gap-2">
                                    <EditAddress address={endereco} />
                                    <RemoveAddress addressId={endereco.id_address} setDeleting={setDeleting} />
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1.5">
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">CEP:</h3> 
                                <p className="pl-2 font-semibold">{endereco.cep_address}</p>
                            </div>
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">Bairro:</h3> 
                                <p className="pl-2 font-semibold">{endereco.district_address}</p>
                            </div>
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">Rua:</h3> 
                                <p className="pl-2 font-semibold">{endereco.street_address}</p>
                            </div>
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">Número:</h3> 
                                <p className="pl-2 font-semibold">{endereco.number_address}</p>
                            </div>
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">Cidade:</h3> 
                                <p className="pl-2 font-semibold">{endereco.city_address}</p>
                            </div>
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">Estado:</h3> 
                                <p className="pl-2 font-semibold">{endereco.country_address}</p>
                            </div>
                            <div className="text-sm text-zinc-400 flex">
                                <h3 className="font-semibold text-white">Complemento:</h3> 
                                <p className="pl-2 font-semibold">{endereco.complet_address}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            :
            <SkeletonComponent type={"address_loader"} />
            }
        </div>
    )
}