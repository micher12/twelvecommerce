"use client";

import { getCategorys } from "@/api/get-categorys";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonComponent } from "@/components/ui/skeleton-componet";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useCreateSubCategory } from "@/models/use-create-sub-category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";

export function CreateSubCategory(){

    const { setAlert, setLoader } = useGetAuthContext() as UseAuthContextProps;
    const { mutateAsync: createSubCategory } = useCreateSubCategory();

    const schema = z.object({
        name_subcategory: z.string().min(4, {message: "Sub Categoria precisa de pelo menos 4 caracteres!"}),
        id_category: z.string().min(1, {message: "Selecione uma categoria!"}),
    })

    type formProps = z.infer<typeof schema>;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name_subcategory: "",
            id_category: "",
        }
    })

    const { data } = useQuery({
        queryKey: ["category"],
        queryFn: getCategorys
    })

    async function handleSubmitForm(data: formProps){
        try {
            setLoader(true);

            const res = await createSubCategory({...data , id_category: Number(data.id_category)});

            if(res.erro)
                return setAlert("erro", res.erro)

            setAlert("sucesso", "Categoria criada com sucesso!");
        } finally {
            setLoader(false);
        }
    }

    return(
        <>
        <h2 className="text-3xl font-bold">Cadastrar Sub Categoria: </h2>
        {data ? (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitForm)} className="mt-5 flex flex-col gap-5">
                    <FormField 
                    control={form.control}
                    name="id_category"
                    render={({ field })=>(
                        <FormItem>
                            <FormLabel>Relacionado a categoria </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value.toString()}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Categoria..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {data.map((category)=>(
                                                <SelectItem key={category.id_category} value={category.id_category.toString()} >{category.name_category}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField 
                    control={form.control}
                    name="name_subcategory"
                    render={({ field })=>(
                        <FormItem>
                            <FormLabel>Nome Sub Categoria </FormLabel>
                            <FormControl>
                                <Input placeholder="Sub Categoria..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button className="w-fit">Cadastrar</Button>
                </form>
            </Form>
        )
        : <SkeletonComponent type={"sub_category"} />
        }
        </>
    )
}