import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddressInterface } from "@/interfaces/use-address-interface";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { useAddressRequest } from "@/interfaces/user-address-request";
import { useUpdateAddress } from "@/models/use-update-address";
import { useGetContext } from "@/lib/useContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pen } from "lucide-react";
import { InputMask } from "primereact/inputmask";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function EditAddress({address}:{address: useAddressInterface}){

    const { mutateAsync: updateAddress } = useUpdateAddress();
    const { setAlert, setLoader } = useGetContext() as UseContextProps;
    const [open, setOpen] = useState(false);

    const schema = z.object({
        cep_address: z.string().refine(val => !val.includes("_"), {message: "CEP Inválido!"}), 
        district_address: z.string().min(5, {message: "Nome do Bairro muito pequeno."}),
        street_address: z.string().min(5, {message: "Nome da Rua muito pequeno."}), 
        number_address: z.number({message: "Número inváldio."}),
        city_address: z.string().min(3, {message: "Nome da Cidade muito pequeno."}),
        country_address: z.string().min(2, {message: "Nome do Estado muito pequeno."}),
        complet_address: z.string().min(3, {message: "Complemento muito pequeno."}),
    })  

    type formProps = z.infer<typeof schema>;

    const form = useForm<formProps>({
        resolver: zodResolver(schema),
        defaultValues:{
            cep_address: address.cep_address,
            district_address: address.district_address,
            street_address: address.street_address,
            number_address: address.number_address,
            city_address: address.city_address,
            complet_address: address.complet_address,
            country_address: address.country_address,
        }
    })

    async function handleSubmitForm(data: formProps) {
        try{
            setLoader(true);

            const res = await updateAddress({id_address: address.id_address, ...data});
            
            if(res.erro)
                setAlert("erro", res.erro);
            
            setAlert("sucesso", "Atualizado com sucesso!");
            setOpen(false);
            return 
        } finally {
            setLoader(false);
        }
    }

    async function getCepAddres(value: string | undefined){
        if(!value || value.includes("_")) return;

        const res: useAddressRequest = await fetch(`https://brasilapi.com.br/api/cep/v1/${value}`).then(res => res.json())

        if(!res) return;

        form.setValue("city_address", res.city);
        form.setValue("district_address", res.neighborhood);
        form.setValue("street_address", res.street);
        form.setValue("country_address", res.state);
       
    }

    return(
        <Dialog open={open} onOpenChange={()=>setOpen(!open)} >
            <DialogTrigger asChild>
                <div className="cursor-pointer bg-zinc-500/50 hover:bg-zinc-400/50 transition p-1 rounded-sm">
                    <Pen className="w-4 h-4 text-amber-500" />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Editar endereço:
                    </DialogTitle>
                    <DialogDescription>
                        Aqui você pode editar o seu endereço.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmitForm)} className="flex flex-col gap-4">
                        <FormField 
                        control={form.control}
                        name="cep_address"
                        render={( {field} )=>(
                            <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                    <InputMask mask="99999-999" {...field} autoClear={false}
                                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                    placeholder="11111-111"
                                    onChange={(e)=> {
                                        getCepAddres(e.target.value?.toString());
                                        field.onChange(e.target.value)
                                    }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="district_address"
                        render={( {field} )=>(
                            <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl>
                                    <Input placeholder="Bairro das..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="street_address"
                        render={( {field} )=>(
                            <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rua dos..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="number_address"
                        render={( {field } )=>(
                            <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                    <Input placeholder="0" {...field} onChange={(e)=> {
                                        if(Number(e.target.value) || e.target.value === "0" || e.target.value.trim() === "")
                                            field.onChange(Number(e.target.value))
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="city_address"
                        render={( {field } )=>(
                            <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                    <Input placeholder="Goiânia" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="country_address"
                        render={( {field } )=>(
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <FormControl>
                                    <Input placeholder="Goiás" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="complet_address"
                        render={( {field } )=>(
                            <FormItem>
                                <FormLabel>Complemento</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <DialogFooter className="flex items-center gap-4 mt-2">
                            <DialogClose asChild>
                                <Button variant={"outline"} className="cursor-pointer" >Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer" >Atualizar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
            <DialogOverlay />
        </Dialog>
    )
}