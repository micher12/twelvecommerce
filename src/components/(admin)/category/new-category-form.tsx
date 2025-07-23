"use client";

import { useCreateCategory } from "@/models/use-create-category";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

export function NewCategoryForm(){

    const { mutateAsync: createCategory } = useCreateCategory();
    const { setAlert, setLoader } = useGetAuthContext() as UseAuthContextProps;

    const schema = z.object({
        name_category: z.string().min(4, {message: "A categoria precisa de pelo menos 5 caracteres!"}).max(30, {message: "Limite de 30 caracteres excedido!"}),
    })

    type formProps = z.infer<typeof schema>;

    const form = useForm<formProps>({
        resolver: zodResolver(schema),
        defaultValues:{
            name_category: ""
        }
    })

    async function handleSendForm(data: formProps){
        try {
            setLoader(true);
            const res = await createCategory({id_category: 0, ...data})

            if(res.erro)
                return setAlert("erro", res.erro);

            setAlert("sucesso", "Categoria criada com sucesso!");
            return;
        } finally {
            setLoader(false);
            form.reset();
        }
        
    }

    return(
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSendForm)} className="flex flex-col gap-5" >

                <FormField 
                control={form.control}
                name="name_category"
                render={({ field })=>(
                    <FormItem>
                        <FormLabel>
                            Nome da categoria
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Eletrônicos" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button className="w-fit cursor-pointer">Cadastrar</Button>
            </form>
        </Form>
    )

}