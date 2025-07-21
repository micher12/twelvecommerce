"use server";

import { getProfileAddress } from "@/api/get-profile-address";
import { ProfileAddressComponent } from "@/components/profile/address/profile-addresses";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ProfileAddress(){

    const addressFetch = async ()=>{

        const res = await getProfileAddress();

        if(res.sucesso)
            return res.address

        return null;
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