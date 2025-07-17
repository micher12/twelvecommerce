"use client";
import { useAddressInterface } from "@/interfaces/use-address-interface";
import { updateAddress } from "@/models/update-address";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateAddress(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (address: useAddressInterface)=> {
            const res = await updateAddress(address);

            return res;
        },
        onMutate: (address) => {
            const oldAddress = queryClient.getQueryData<useAddressInterface[]>(["user", "user-address"])

            return {address, oldAddress}
        },
        onSuccess: (_data, _variables, context) => {
            queryClient.setQueryData<useAddressInterface[]>(["user", "user-address"], prev => {
                if(!prev) return [context.address];

                return prev.map(addr =>
                    addr.id_address === context.address.id_address ? context.address : addr
                );
                
            })
        }
    })
}