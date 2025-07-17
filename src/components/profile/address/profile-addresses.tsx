"use client";

import { Plus, X } from "lucide-react";
import { Button } from "../../ui/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAddressInterface } from "@/interfaces/use-address-interface";
import { Card, CardContent, CardDescription, CardHeader } from "../../ui/card";
import { EditAddress } from "./edit-address";
import { SkeletonComponent } from "@/components/ui/skeleton-componet";

export function ProfileAddressComponent(){


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
            <Button className="w-fit cursor-pointer flex items-center gap-2" variant={"outline"} ><Plus/> Cadastrar novo endereço</Button>

            <h2 className="text-lg font-semibold my-4">Endereços cadastrados: </h2>
            {!loadingEnderecos ?
            <div className="flex w-full gap-8 flex-wrap">
                {enderecos?.map((endereco,index)=>(
                    <Card key={endereco.id_address} className="bg-zinc-700/50 shadow-lg rounded-lg! w-full sm:w-[calc((100%/2)-16px)] 2lg:w-[calc((100%/3)-16px)] gap-1" >
                        <CardHeader>
                            <CardDescription className="flex justify-between items-center ">
                                {`${index+1}° Endereço`} 
                                <div className="flex items-center gap-2">
                                    <EditAddress address={endereco} />
                                    <div className="cursor-pointer bg-zinc-500/50 hover:bg-zinc-400/50 transition p-1 rounded-sm">
                                        <X className="w-4 h-4 text-red-500" />
                                    </div>
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
            <SkeletonComponent />
            }
        </div>
    )
}