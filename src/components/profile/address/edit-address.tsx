import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pen } from "lucide-react";

export  function EditAddress(){
    return(
        <Dialog>
            <DialogTrigger asChild>
                <div className="cursor-pointer bg-zinc-500/50 hover:bg-zinc-400/50 transition p-1 rounded-sm">
                    <Pen className="w-4 h-4 text-amber-500" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Editar endereço:
                </DialogTitle>
                Conteúdo
            </DialogContent>
            <DialogOverlay />
        </Dialog>
    )
}