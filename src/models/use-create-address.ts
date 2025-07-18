import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "./create-address";
import { useAddressInterface } from "@/interfaces/use-address-interface";

export function useCreateAddress(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (address: useAddressInterface)=>{
            const res = await createAddress(address);

            return res;
        },
        onMutate(address){
            const oldAddress = queryClient.getQueryData<useAddressInterface[]>(["user", "user-address"]);

            return {address, oldAddress};
        },
        onSuccess(data, _variables, context) {
            if(!data.sucesso) return;

            queryClient.setQueryData<useAddressInterface[]>(["user","user-address"], (prev)=>{
                if(!prev) return [];

                const newAddress: useAddressInterface = {
                    ...context.address,
                    id_address: data.id,
                }

                return [...context.oldAddress ?? [], newAddress];
            })
        },
    })
}