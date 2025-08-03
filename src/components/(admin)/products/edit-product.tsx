"use client";

import { getCategorys } from "@/api/get-categorys";
import { getSingleProduct } from "@/api/get-single-product";
import { getSubCategorys } from "@/api/get-sub-categorys";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarCheckbox } from "@/components/ui/star-checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AttributeChange, VariationChange } from "@/interfaces/modified-attributes";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { useProductInterface } from "@/interfaces/use-product-interface";
import { useGetAuthContext } from "@/lib/useAuthContext";
import { useUpdateProduct } from "@/models/use-update-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react";
import { InputNumber } from "primereact/inputnumber";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod/v4";
import { EditVariations } from "./variations-edit-form";

type paramsProps = {
    id: number
}

type attributesProps = {
    name_attribute: string,
    value_attribute: string,
}

type attributesArray = {
    variation: {
        id_variation: number;
        price_variation: number;
        amount_variation: 5;
    };
    attributes: attributesProps[];
}


export function EditProduct({id}: paramsProps){

    const { setAlert } = useGetAuthContext() as UseAuthContextProps;
    const { mutateAsync: updateProduct } = useUpdateProduct();

    const fetchSingleProduct = async()=>{
        const res = await getSingleProduct({id_product: id});

        if(res.sucesso) return res.product;

        return null;
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

    const { data, isLoading } = useQuery({
        queryKey: ["single-product", id],
        queryFn: fetchSingleProduct,
        staleTime: 0,
    })

    const product = data?.[0];

    const custom: attributesArray[] = data?.flatMap(({id_variation, price_variation, amount_variation,attributes})=>{
        const attributesArray: attributesProps[] = JSON.parse(attributes);
        return { variation: {id_variation, price_variation, amount_variation}, attributes: attributesArray };
    }) as attributesArray[];

    const schema = z.object({
        id_product: z.number(),
        name_product: z.string().min(5, {message: "Deve conter pelo menos 5 caracteres!"}),
        description_product: z.string().min(10, {message: "Deve conter pelo menos 10 caracteres!"}),
        id_category: z.string().min(1, {message: "Escolha uma categoria!"}),
        id_subcategory: z.string().nullable(),
        price_product: z.number({message: "Valor não pode ser nulo"}).min(1, {message: "Defina um valor maior que 0"}),
        star_product: z.boolean(),
        variations: z.array(z.object({
            id_variation: z.number(),
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
            id_product: 0,
            price_product: 0,
            star_product: false,
            variations: [
                {
                    amount_variation: 0,
                    id_variation: 0,
                    price_variation: 0,
                    attributes: [{
                        name_attribute: "",
                        value_attribute: "",
                    }]
                }
            ]
        }
    })

    const selectedCategoria = form.watch("id_category");


    const filtredSubCategoria = useMemo(() => {
        return subCategorys?.filter(
            (sub) => sub.id_category === Number(selectedCategoria)) ?? [];
    }, [subCategorys, selectedCategoria]);

    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        if (product && !isLoading && custom) {

            setIsResetting(true);

            const formData: formProps = {
                id_product: product.id_product,
                name_product: product.name_product || "",
                description_product: product.description_product || "",
                id_category: product.id_category?.toString() || "",
                id_subcategory: product.id_subcategory?.toString() || null,
                price_product: product.price_product || 0,
                star_product: product.star_product === "true",
                variations: custom.map(({variation, attributes})=>{
                    const data = {
                        id_variation: variation.id_variation,
                        price_variation: variation.price_variation,
                        amount_variation: variation.amount_variation,
                        attributes: attributes
                    }

                    return data;
                })
            };

            form.reset(formData);

            setTimeout(()=>{
                setIsResetting(false);
            }, 100);

        }
    }, [product, isLoading, form]);

    function getModifiedVariations(
        original: {
            id_variation: number;
            price_variation: number;
            amount_variation: number;
            attributes: {
            name_attribute: string;
            value_attribute: string;
            }[];
        }[],
        current: {
            id_variation: number;
            price_variation: number;
            amount_variation: number;
            attributes: {
            name_attribute: string;
            value_attribute: string;
            }[];
        }[]
        ): VariationChange[] {
        const changes: VariationChange[] = [];

        current.forEach((currVar) => {
            // NOVA VARIAÇÃO
            if (currVar.id_variation === 0) {
            changes.push({
                id_variation: 0,
                price_variation: currVar.price_variation,
                amount_variation: currVar.amount_variation,
                attributes: currVar.attributes.map((attr) => ({
                new: {
                    name_attribute: attr.name_attribute,
                    value_attribute: attr.value_attribute,
                },
                })),
            });
            return;
            }

            const oldVar = original.find((o) => o.id_variation === currVar.id_variation);
            if (!oldVar) return;

            const variationChange: VariationChange = {
            id_variation: currVar.id_variation,
            };

            // Comparar price
            if (oldVar.price_variation !== currVar.price_variation) {
            variationChange.price_variation = currVar.price_variation;
            }

            // Comparar amount
            if (oldVar.amount_variation !== currVar.amount_variation) {
            variationChange.amount_variation = currVar.amount_variation;
            }

            // Comparar attributes
            const attrChanges: AttributeChange[] = [];

            currVar.attributes.forEach((attr, index) => {
            const oldAttr = oldVar.attributes[index];
            if (
                !oldAttr ||
                oldAttr.name_attribute !== attr.name_attribute ||
                oldAttr.value_attribute !== attr.value_attribute
            ) {
                attrChanges.push({
                ...(oldAttr && {
                    old: {
                    name_attribute: oldAttr.name_attribute,
                    value_attribute: oldAttr.value_attribute,
                    },
                }),
                new: {
                    name_attribute: attr.name_attribute,
                    value_attribute: attr.value_attribute,
                },
                });
            }
            });

            if (attrChanges.length > 0) {
            variationChange.attributes = attrChanges;
            }

            if (
            variationChange.price_variation !== undefined ||
            variationChange.amount_variation !== undefined ||
            variationChange.attributes
            ) {
            changes.push(variationChange);
            }
        });

        return changes;
    }



    async function handleSubmitForm(thisData: formProps){
        if(!product) return

        const changes: { key: string; newValue: string }[] = [];

        const productValues: useProductInterface = {
            id_product: thisData.id_product,
            name_product: thisData.name_product,
            description_product: thisData.description_product,
            id_category: Number(thisData.id_category),
            id_subcategory: Number(thisData.id_subcategory),
            price_product: thisData.price_product,
            star_product: thisData.star_product.toString(),
            createdat: "",
        }

        const keys = Object.keys(productValues) as (keyof useProductInterface)[];

        for (const key of keys){
            if(key === "createdat") continue;
            
            const oldValue = product[key];
            const newValue = productValues[key].toString();

            if(oldValue.toString().trim() !== newValue.toString().trim()){
                changes.push({
                    key,
                    newValue,
                })
            }
        }


        const old = custom.map((item) => ({
            amount_variation: item.variation.amount_variation ?? 0,
            price_variation: item.variation.price_variation ?? 0,
            id_variation: item.variation.id_variation ?? 0,
            attributes: item.attributes
        }));

        const variations = getModifiedVariations(old, thisData.variations) as VariationChange[];

        const chandeData = {
            id: thisData.id_product,
            changes,
            variations
        }

        const res = await updateProduct(chandeData)
        
        if(res?.warning)
            return setAlert("warning", res.warning);

        if(res?.erro)
            return setAlert("erro", res.erro);

        setAlert("sucesso", "Produto atualizado com sucesso!");
    }

    const {fields: variations, append, remove} = useFieldArray({control: form.control, name: "variations"})

    if(isLoading)
        return <h2>CARREGANDO</h2>

    return(
        <div>
            <h2 className="text-3xl font-bold">Editar produto:</h2>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(handleSubmitForm)}
                className="flex flex-col gap-5 mt-5">
                    <FormField 
                    control={form.control}
                    name="name_product"
                    render={({field})=>(
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
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Preço base</FormLabel>
                            <FormControl>
                                <InputNumber 
                                value={field.value}
                                onChange={(e)=> field.onChange(e.value)}
                                locale="pt-BR"
                                currency="BRL"
                                mode="currency"
                                minFractionDigits={2}
                                maxFractionDigits={2}
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
                                        value={field.value}
                                        onValueChange={val => {
                                            if(!isResetting){
                                                field.onChange(val);
                                                form.setValue("id_subcategory", null);
                                            }
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

                            {filtredSubCategoria?.length > 0 && (
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
                                <StarCheckbox key={`key-${field.value}`} checked={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
       
                    
                        <FormField 
                        control={form.control}
                        name="variations"
                        render={()=>(
                            <FormItem>
                                <div 
                                onClick={()=>append({
                                    amount_variation: 0,
                                    id_variation: 0,
                                    price_variation: form.getValues("price_product"),
                                    attributes: [{
                                        name_attribute: "",
                                        value_attribute: ""
                                    }]
                                })}
                                className="flex items-center gap-2 bg-zinc-200 text-zinc-900 font-semibold w-fit px-2 rounded-md cursor-pointer py-0.5"
                                >
                                    <Plus size={16} /> Adicionar variação
                                </div>

                                <div className="flex items-start gap-8 flex-wrap mt-5">
                                    {variations.map((variation, index)=>(
                                        <EditVariations 
                                            key={variation.id}
                                            length={variations.length}
                                            index={index}
                                            product={product}
                                            variation={variation}
                                            remove={remove}
                                            form={form}
                                        />
                                    ))}
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    <Button type="submit" className="w-fit font-semibold cursor-pointer">Atualizar</Button>

                </form>
            </Form>
        </div>
    )
}