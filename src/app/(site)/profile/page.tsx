import { Perfil } from "@/components/perfil";
import { useUserInterface } from "@/interfaces/use-user-interface";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Profile(){

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: async ()=>{
            const res: {sucesso?: "ok", user?: useUserInterface, erro?: "Inváldio"} = await fetch("/api/user").then(res => res.json());

            if(res.sucesso)
                return res.user

            return null;
        },
    })  

    return (
        <div className="min-h-screen py-25! container">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Perfil />
            </HydrationBoundary>
        </div>
    )
}