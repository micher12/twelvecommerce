"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { InputMask } from "primereact/inputmask";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAddressInterface } from "@/interfaces/use-address-interface";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddressRequest } from "@/interfaces/user-address-request";
import { useGetContext } from "@/lib/useContext";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { useCreateAddress } from "@/models/use-create-address";
import { useState } from "react";

export function CreateNewAddress(){

    const { setAlert, setLoader } = useGetContext() as UseContextProps; 
    const { mutateAsync: createAddress } = useCreateAddress();
    const [open, setOpen] = useState(false);

    const schema = z.object({
        cep_address: z.string().min(2, {message: "CEP inválido!"}).refine(val => !val.includes("_"), {message: "CEP inválido!"}),
        street_address: z.string().min(3, {message: "Nome da rua é muito pequeno"}),
        district_address: z.string().min(3, {message: "Nome do bairro é muito pequeno"}),
        number_address: z.number({message: "Número inválido"}),
        complet_address: z.string().min(5, {message: "Complemento é muito pequeno"}),
        city_address: z.string().min(3, {message: "Nome da cidade é muito pequeno"}),
        country_address: z.string().min(3, {message: "Nome do estado é muito pequeno"}),
    })

    type formProps = z.infer<typeof schema>;

    const form = useForm<formProps>({
        resolver: zodResolver(schema),
        defaultValues:{
            cep_address: "",
            city_address: "",
            complet_address: "",
            country_address: "",
            district_address: "",
            number_address: 0,
            street_address: "",
        }
    })

    async function getCepAddres(cep: string | undefined){
        if(!cep || cep.includes("_")) return;

        const api = await fetch(`https://viacep.com.br/ws/${cep}/json/ `)

        const res: useAddressRequest = await api.json();

        form.setValue("city_address", res.localidade);
        form.setValue("district_address", res.bairro);
        form.setValue("street_address", res.logradouro);
        form.setValue("country_address", res.estado);

    }

    async function handleCreateNewAddress(form: formProps){
        try {
            setLoader(true);

            const newAddress: useAddressInterface = {
                id_address: 0,
                ...form
            }

            const res = await createAddress(newAddress);

            if(!res.sucesso)
                return setAlert("erro", res.erro as string);

            setOpen(false);
            return setAlert("sucesso", "Endereço cadastrado com sucesso!");

        } finally {
            setLoader(false);
        }
    }

    return(
        <Dialog open={open} onOpenChange={()=>setOpen(!open)} >
            <DialogTrigger asChild>
                <Button className="w-fit cursor-pointer flex items-center gap-2" variant={"outline"} ><Plus/> Cadastrar novo endereço</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Criar novo endereço: 
                    </DialogTitle>
                    <DialogDescription>
                        Coloque seus dados para cadastrar um novo endereço!
                    </DialogDescription>
                </DialogHeader>

                <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleCreateNewAddress)} className="flex flex-col gap-4" >
                        <FormField 
                        control={form.control}
                        name="cep_address"
                        render={({ field })=> (
                            <FormItem>
                                <FormLabel>CEP:</FormLabel>
                                <FormControl>
                                    <InputMask autoClear={false} mask="99999-999"  {...field} 
                                    onChange={(e)=> {
                                        getCepAddres(e.target.value?.toString())
                                        field.onChange(e.target.value);
                                    }}
                                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                    placeholder="11111-111"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                
                        <FormField 
                        control={form.control}
                        name="street_address"
                        render={({ field })=> (
                            <FormItem>
                                <FormLabel>Rua:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rua dos..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className="flex justify-between gap-4">
                            <FormField 
                            control={form.control}
                            name="district_address"
                            render={({ field })=> (
                                <FormItem className="flex-2">
                                    <FormLabel>Bairro:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bairro das..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField 
                            control={form.control}
                            name="number_address"
                            render={({ field })=> (
                                <FormItem className="flex-1">
                                    <FormLabel>Número:</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0"
                                        {...field} className="no-spinner"
                                        onChange={(e)=> field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                      

                        <div className="flex justify-between gap-4">
                            <FormField 
                            control={form.control}
                            name="city_address"
                            render={({ field })=> (
                                <FormItem className="flex-2">
                                    <FormLabel>Cidade:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Goiânia" {...field}  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField 
                            control={form.control}
                            name="country_address"
                            render={({ field })=> (
                                <FormItem className="flex-1">
                                    <FormLabel>Estado:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Goiás" {...field}  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        

                        <FormField 
                        control={form.control}
                        name="complet_address"
                        render={({ field })=> (
                            <FormItem>
                                <FormLabel>Complemento:</FormLabel>
                                <FormControl>
                                    <Textarea  placeholder="Qd.0 Lt.0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <DialogFooter className="mt-2">
                            <DialogClose asChild>
                                <Button variant={"outline"} className="cursor-pointer" >Cancelar</Button>
                            </DialogClose>
                            <Button className="cursor-pointer bg-green-500/50! text-whit" >Cadastrar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}