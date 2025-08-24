"use client";

import { getCategorys } from "@/api/get-categorys";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { InputNumber } from 'primereact/inputnumber';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StarCheckbox } from "@/components/ui/star-checkbox";
import { Plus } from "lucide-react";
import React from "react";
import { useProductInterface } from "@/interfaces/use-product-interface";
import { useVariationInterface } from "@/interfaces/use-variation-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useCreateProduct } from "@/models/use-create-product";
import { CreateVariations } from "./variations-create-form";
import ImageUploader from "@/components/image-uploader";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { getApp, initializeApp } from "firebase/app";
import { getFirebaseConfig } from "@/lib/use-firebase-config";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useInsertImagesProduct } from "@/models/use-insert-images-product";

export function FormCreateProduct(){

    const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
    const { setAlert } = useGetAuthContext() as UseAuthContextProps;
    const { mutateAsync: createProduct } = useCreateProduct();
    const { mutateAsync: insertImageProduct } = useInsertImagesProduct();

    const queryClient = useQueryClient();

    async function initMyApp(){
        try {
            return getApp();
        } catch {
            const firebaseConfig = await getFirebaseConfig();
            return initializeApp(firebaseConfig);
        }
    }

    const fetchCategory = async ()=>{
        return await getCategorys();
    }

    const fetchSubCategory = async ()=>{
        const res = await getSubCategorys();

        if(res.sucesso)
            return res.res;

        return null;
    }

    const { data: categorys } = useQuery({
        queryKey: ["category"],
        queryFn: fetchCategory
    })

    const { data: subCategorys } = useQuery({
        queryKey: ["sub_category"],
        queryFn: fetchSubCategory
    })

    const filtredSubCategoria = useMemo(()=>{
        return subCategorys?.filter(prev => prev.id_category === selectedCategoria);
    },[subCategorys, selectedCategoria])

    const schema = z.object({
        name_product: z.string().min(5, {message: "Deve conter pelo menos 5 caracteres!"}),
        description_product: z.string().min(10, {message: "Deve conter pelo menos 10 caracteres!"}),
        id_category: z.string().min(1, {message: "Escolha uma categoria!"}),
        id_subcategory: z.string().nullable(),
        price_product: z.number({message: "Valor não pode ser nulo"}).min(1, {message: "Defina um valor maior que 0"}),
        star_product: z.boolean(),
        files: z.any(),
        variations: z.array(z.object({
            price_variation: z.number().min(1, {message: "Defina um valor maior que 0"})
            .refine(val => {
                if(val >= form.getValues("price_product"))
                    return true;
            }, {message: "O valor deve ser maior ou igual ao preço base."}),
            amount_variation: z.number().min(1, {message: "Quantidade deve ser maior que 0"}),
            attributes: z.array(z.object({
                name_attribute: z.string().min(2, {message: "Deve conter pelo menos 2 caracteres"}),
                value_attribute: z.string().min(2, {message: "Deve conter pelo menos 2 caracteres"}),
            })).min(1, {message: "Precisa ter ao menu um atributo."})
        })).min(1, {message: "Deve ter ao menos uma variação."})
    })

    type formProps = z.infer<typeof schema>;

    const form = useForm<formProps>({
        resolver: zodResolver(schema),
        defaultValues: {
            name_product: "",
            description_product: "",
            id_category: "",
            id_subcategory: null,
            files: null,
            price_product: 0,
            star_product: false,
        }
    })

    const { fields, append, remove } = useFieldArray({control: form.control, name: "variations"})
    const [files, setFiles] = useState<FileWithPreview[] | null>(null);

    useEffect(()=>{
        form.setValue("files", files);
    },[files]);

    async function handleSubmitForm(data: formProps){
        
        if(!files || files.length <= 0) return form.setError("files", {
            type: "required",
            message: "Adicione pelo menos uma imagem!"
        })

        const finalData: {
            product: useProductInterface
            variations: useVariationInterface[]
        } = {
            product: {
                id_product:0,
                id_category: Number(data.id_category),
                id_subcategory: Number(data.id_subcategory),
                name_product: data.name_product,
                description_product: data.description_product,
                price_product: data.price_product,
                star_product: data.star_product.toString(),
                createdat: new Date().toISOString(),
            },
            variations: data.variations,
        }

        const res = await createProduct(finalData);

        if(res.erro)
            return setAlert("erro", res.erro);


        const app = await initMyApp();
        getAuth(app);
        const storage = getStorage(app);

        const id_product = res.id_product as number;

        const promises = [];

        for(const { file, capa } of files){
            const randomId = uuidv4();
            const name_image = `${capa ? "capa_" : ""}${randomId}`;
            const refStorage = ref(storage, `twelve_products/${id_product}/${name_image}`);
            const uploadPromise = uploadBytes(refStorage, file as File).then(() => getDownloadURL(refStorage))
            promises.push(uploadPromise);
        }

        const urls = await Promise.all(promises);

        await insertImageProduct({urls, id_product});

        queryClient.setQueryData<useProductInterface[]>(["products", undefined, undefined, 1, 10], (prev) => {
            if(!prev) return prev;
            
            return prev.map((item)=>{
                if(item.id_product === id_product){
                    return {...item, urls_product: JSON.stringify(urls)};
                }

                return item;
            })
        });

        setAlert("sucesso", "Produto cadastrado com sucesso!");
    }


    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitForm)} 
            className="flex flex-col gap-5 mt-5">
                
                <FormField 
                control={form.control}
                name="name_product"
                render={({ field })=>(
                    <FormItem>
                        <FormLabel>Nome do produto</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField 
                control={form.control}
                name="price_product"
                render={({ field })=>(
                    <FormItem>
                        <FormLabel>Preço base</FormLabel>
                        <FormControl>
                            <InputNumber 
                            value={field.value} 
                            onChange={(e)=>field.onChange(e.value)}
                            locale="pt-BR"
                            minFractionDigits={2}
                            maxFractionDigits={2}
                            mode="currency" 
                            currency="BRL"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <div className="flex items-start gap-5 flex-wrap">

                    <FormField 
                    control={form.control}
                    name="description_product"
                    render={({ field })=>(
                        <FormItem className="flex-1/1 sm:flex-3">
                            <FormLabel>Descrição do produto</FormLabel>
                            <FormControl>
                                <Textarea className="h-30"  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />


                    <div className="flex sm:flex-col gap-5 flex-1">
                        <FormField 
                        control={form.control}
                        name="id_category"
                        render={({ field })=>(
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <FormControl>
                                    <Select 
                                    value={field.value.toString()}
                                    onValueChange={(e)=>{
                                        field.onChange(e)
                                        setSelectedCategoria(Number(e.valueOf()))
                                        form.setValue("id_subcategory", null);
                                    }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categorys 
                                                ? categorys.map((category)=>(
                                                    <SelectItem key={category.id_category} value={category.id_category.toString()} >{category.name_category}</SelectItem>
                                                ))
                                                : <h2>Carregando...</h2>}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        {filtredSubCategoria && filtredSubCategoria?.length > 0 && (
                            <FormField 
                            control={form.control}
                            name="id_subcategory"
                            render={({ field })=>(
                                <FormItem>
                                    <FormLabel>Sub Categoria</FormLabel>
                                    <FormControl>
                                        <Select 
                                        value={(field.value ?? "").toString()}
                                        onValueChange={(e)=>{
                                            field.onChange(e === "0" ? null : e)
                                        }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sub Categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="0">Nenhuma</SelectItem>
                                                    {filtredSubCategoria.map((category)=>(
                                                        <SelectItem key={category.id_subcategory} value={category.id_subcategory.toString()} >{category.name_subcategory}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        )}
                    </div>
        
                </div>

                

                <FormField 
                control={form.control}
                name="star_product"
                render={({ field })=>(
                    <FormItem>
                        <FormLabel>
                            Produto Estrela
                            <Tooltip>
                                <TooltipTrigger>
                                    <h2 className="text-xs font-bold px-[5px] rounded-full bg-zinc-500/80">?</h2>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Um produto estrela tem preferência<br/> para mostrar no feed de produtos.
                                </TooltipContent>
                            </Tooltip>
                        </FormLabel>
                        <FormControl>
                            <StarCheckbox checked={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField 
                name="files"
                render={()=>(
                    <FormItem>
                        <ImageUploader setFile={setFiles} />
                        <FormMessage />
                    </FormItem>
                )}
                />

                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Variações: </h2>
                    <Tooltip>
                        <TooltipTrigger>
                            <h2 className="text-xs font-bold px-[5px] rounded-full bg-zinc-500/80">?</h2>
                        </TooltipTrigger>
                        <TooltipContent>
                            Cada produto precisa ter pelo menos uma variação. Ex: <br/>
                            <b className="text-xs">Cor: Preto</b> <br/>
                            <b className="text-xs">Armazenamento: 256GB, 512GB</b>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div 
                onClick={()=>append({
                    amount_variation: 0,
                    price_variation: form.getValues("price_product"),
                    attributes: [{
                        name_attribute: "",
                        value_attribute: ""
                    }]
                })}
                className="flex items-center gap-2 bg-zinc-200 text-zinc-900 font-semibold w-fit px-2 rounded-md cursor-pointer py-0.5"
                >
                    <Plus/> Adicionar variação
                </div>

                <FormField
                control={form.control}
                name="variations"
                render={()=>(
                    <FormItem>
                        <div className="flex items-start gap-8 flex-wrap">
                            {fields.map((campos, index)=>(
                                <CreateVariations 
                                    key={campos.id}
                                    form={form}
                                    index={index}
                                    remove={remove}
                                />
                            ))}
                        </div>

                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button className="w-fit cursor-pointer font-semibold">Cadastrar</Button>

            </form>
        </Form>
    )

}