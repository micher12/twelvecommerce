import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "./delete-address";
import { useAddressInterface } from "@/interfaces/use-address-interface";

export function useDeleteAddress(){

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (idAddress: number)=>{
            const res = await deleteAddress(idAddress);
            return {sucesso: res === "sucesso", idAddress};
        },
        onSuccess({sucesso, idAddress}) {
            if(!sucesso) return;

            queryClient.setQueryData<useAddressInterface[]>(["user", "user-address"], (prev)=> {
                if(!prev) return [];

                return prev.filter(address=> address.id_address !== idAddress);
            })
        },
    })
}