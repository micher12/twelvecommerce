"use client";

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAddress } from "@/models/use-delete-address";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export function RemoveAddress({addressId, setDeleting}:{addressId: number, setDeleting: Dispatch<SetStateAction<{
    state: boolean;
    id: null | number;
}>>}){

    const { mutateAsync: deleteAddress } = useDeleteAddress();

    async function handleDeleteAddress(){
        try {
            setDeleting({state: true, id: addressId});
            await deleteAddress(addressId);
        } finally {
            setDeleting({state: false, id: null});
        }
    }

    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="cursor-pointer bg-zinc-500/50 hover:bg-zinc-400/50 transition p-1 rounded-sm">
                    <X className="w-4 h-4 text-red-500" />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent >
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Excluir endereço
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Você realmente deseja excluir este endereço? <br/> Não será possível reverter esta ação!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant={"outline"} className="cursor-pointer" >Cancelar</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleDeleteAddress} variant={"destructive"} className="cursor-pointer bg-red-500/50! text-white! hover:bg-red-600/50!" >Excluir</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}