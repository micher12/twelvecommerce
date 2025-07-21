"use server";

import { getProfile } from "@/api/get-profile";
import { ProfileProvider } from "@/components/profile/profile-provider";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";


export default async function LayoutProfile({children}:{children: ReactNode}){

    const preFetchUser = async ()=>{

        const res = await getProfile();

        if(res.sucesso)
            return res.user;

        return null;
    }

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
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