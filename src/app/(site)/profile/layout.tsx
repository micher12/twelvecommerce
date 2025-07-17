"use server";

import { ProfileProvider } from "@/components/profile/profile-provider";
import { useUserInterface } from "@/interfaces/use-user-interface";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { ReactNode } from "react";

type requestProfile = {
    sucesso?: string;
    erro?: string;
    user?: useUserInterface;
}

export default async function LayoutProfile({children}:{children: ReactNode}){

    const preFetchUser = async ()=>{

        const cookie = await cookies();

        const session = cookie.get("session");

        if(!session) return null;

        const res: requestProfile = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/profile`,{
            headers:{
                cookie: `${session.name}=${session.value}`,
            }
        })
        .then(res => res.json());

        if(res.erro)
            return null;

        return res.user;
    }

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["user"],
        queryFn: preFetchUser,
    })

    return (
        <div className=" py-25! container-xl relative">

            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProfileProvider>
                    {children}
                </ProfileProvider>
            </HydrationBoundary>
        
        </div>
    )
}