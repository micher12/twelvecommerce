"use server";

import { ProfileAddressComponent } from "@/components/profile/address/profile-addresses";
import { useAddressInterface } from "@/interfaces/use-address-interface";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";

type requestAddressFetch = {
    sucesso?: "ok";
    address?: useAddressInterface[];
    erro?: string;
}

export default async function ProfileAddress(){

    const addressFetch = async ()=>{

        const cookie = await cookies();

        const session = cookie.get("session");

        if(!session) return null;

        const res: requestAddressFetch = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/profile/address`,{
            headers:{
                cookie: `${session.name}=${session.value}`
            }
        })
        .then(res => res.json());

        if(res.erro)
            return null

        return res.address;
    }

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: ["user", "user-address"],
        queryFn: addressFetch,
    });

    return(
        <HydrationBoundary state={dehydrate(queryClient)} >
            <ProfileAddressComponent />
        </HydrationBoundary>
    )
}