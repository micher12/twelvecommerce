"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AuthUserLogOut } from "@/models/user-logout";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { useGetContext } from "@/lib/useContext";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUserInterface } from "@/interfaces/use-user-interface";

export function Perfil(){

    const { setAlert } = useGetContext() as UseContextProps;
    const router = useRouter();

    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: async ()=>{
            const res: {sucesso?: "ok", user?: useUserInterface, erro?: "Inváldio"} = await fetch("/api/user").then(res => res.json());

            if(res.sucesso)
                return res.user

            return null;
        },
        placeholderData: keepPreviousData,
    })


    async function logOut(){
        const res = await AuthUserLogOut();
        if(res === "ok"){
            setAlert("sucesso", "Sessão finalizada!");
            router.push("/home");
        }
    }


    return (
        <>
        <h2 className="text-3xl font-bold mb-2">Perfil</h2>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                     {data && (
                        <h2 className="">Olá, {data.name_user}! Seja bem vindo!</h2>
                    )}
                </CardTitle>
                     
                <Button onClick={logOut} variant={"destructive"} className="cursor-pointer hover:bg-red-800!" ><LogOut /> Sair  </Button>
      
                <CardDescription>
                    
                </CardDescription>
            </CardHeader>
        </Card>
        </>
    )
}