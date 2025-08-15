import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface"
import { useSingleProductInterface } from "@/interfaces/use-single-product"
import { useGetAuthContext } from "@/lib/useAuthContext"
import { deleteAttribute } from "@/models/delete-attribute"
import { deleteVariation } from "@/models/delete-variation"
import { CircleX, Plus, X } from "lucide-react"
import { InputNumber } from "primereact/inputnumber"
import { FieldArrayWithId, useFieldArray, UseFieldArrayRemove, UseFormReturn } from "react-hook-form"


interface EditVariationsProps{
    index: number;
    form: UseFormReturn<{
        id_product: number;
        name_product: string;
        description_product: string;
        id_category: string;
        id_subcategory: string | null;
        price_product: number;
        star_product: boolean;
        urls_product: string;
        variations: {
            id_variation: number;
            price_variation: number;
            amount_variation: number;
            attributes: {
                name_attribute: string;
                value_attribute: string;
            }[];
        }[];
    }>;
    product: useSingleProductInterface | undefined;
    variation: FieldArrayWithId<{
        id_product: number;
        name_product: string;
        description_product: string;
        id_category: string;
        id_subcategory: string | null;
        price_product: number;
        star_product: boolean;
        variations: {
            id_variation: number;
            price_variation: number;
            amount_variation: number;
            attributes: {
                name_attribute: string;
                value_attribute: string;
            }[];
        }[];
    }, "variations", "id">;
    remove: (index: number)=> void;
    length: number;
}

export function EditVariations({index, form, product, variation, remove, length}: EditVariationsProps){

    const { setAlert } = useGetAuthContext() as UseAuthContextProps;

    async function handleDeleteVariation(id_variation: number, remove: (val: number)=> void, index: number, length: number){
        if(id_variation === 0) return remove(index);

        if(length <= 1) return setAlert("erro", "Mínimo de 1 variação atingida!")

        const res = await deleteVariation(id_variation, product?.id_product as number);

        if(res.erro)
            return setAlert("erro", res.erro);

        setAlert("sucesso", "Variação excluída com sucesso!");
        remove(index);       
    }  

    async function handleDeleteAttribute(removeAttributes: UseFieldArrayRemove, attributeIndex: number, attribute: {name_attribute: string, value_attribute: string}, id_variation: number) {

        if(attribute.name_attribute.trim() === "" && attribute.value_attribute.trim() === "")
            return removeAttributes(attributeIndex);
        
        const res = await deleteAttribute(id_variation, attribute, product?.id_product as number);

        if(res.erro)
            return setAlert("erro", res.erro);

        removeAttributes(attributeIndex);
        setAlert("sucesso", "Atributo excluído com sucesso!");
    }

    const { fields: attributes, append: appendAttributes, remove: removeAttributes } = useFieldArray({control: form.control, name: `variations.${index}.attributes`})

    return(
        <Card className="w-full sm:w-[calc((100%/2)-16px)] lg:w-[calc((100%/3)-21.5px)]">
            <CardContent className="flex flex-col gap-3">
                <CardDescription className="flex items-center justify-between">
                    <div>{index+1}° Variação</div>
                    
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={"ghost"} className="cursor-pointer text-red-400/80 hover:text-red-400 " size={"icon"} >
                                    <CircleX className="w-5! h-5!" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Deseja excluir está variação?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Após confirmar está ação todo o conjunto da variação será excluído permanentemente, está ação <b>não poderá ser desfeita.</b>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button onClick={()=>{
                                            handleDeleteVariation(variation.id_variation, remove, index, length)
                                        }} className="bg-red-500/50 hover:bg-red-600/50 focus:bg-red-500/50 text-white cursor-pointer">Excluir</Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    
                </CardDescription>

                <FormField 
                control={form.control}
                name={`variations.${index}.price_variation`}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>
                            Valor variação
                            <Tooltip>
                                <TooltipTrigger>
                                    <h2 className="text-xs font-bold px-[5px] rounded-full bg-zinc-500/80">?</h2>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Será o <b>valor de compra</b> do produto desta <b>variação</b>
                                </TooltipContent>
                            </Tooltip>
                        </FormLabel>
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
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <FormField 
                control={form.control}
                name={`variations.${index}.amount_variation`}
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Quantidade disponível</FormLabel>
                        <FormControl>
                            <InputNumber
                            value={field.value} 
                            onChange={(e)=>field.onChange(e.value)}
                            showButtons 
                            className="w-30 incrementInput"
                            buttonLayout="horizontal"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <FormField 
                control={form.control}
                name={`variations.${index}.attributes`}
                render={()=> (
                    <FormItem className="mt-5">
                        {attributes.map((attribute, attributeIndex)=>(
                            <div key={attribute.id} className="flex flex-col gap-3 relative" >

                                <FormField 
                                control={form.control}
                                name={`variations.${index}.attributes.${attributeIndex}.name_attribute`}
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel className="flex justify-between">
                                            Nome do atributo
                                            {(attributeIndex > 0) && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                        type="button"
                                                        size={"icon"}
                                                        variant={"ghost"}
                                                        className="bg-red-400/80 hover:bg-red-400! focus:bg-red-400/80 w-6 h-6 font-semibold cursor-pointer"
                                                        >
                                                            <X size={16} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Deseja excluir este atributo ?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Após confirmar, está ação <b>não poderá ser desfeita.</b>
                                                            </AlertDialogDescription>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Cancelar
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                className="bg-red-500/50 text-white hover:bg-red-600/50 transition cursor-pointer"
                                                                onClick={()=>handleDeleteAttribute(removeAttributes, attributeIndex, attribute, variation.id_variation)}
                                                                >
                                                                    Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogHeader>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cor" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField 
                                control={form.control}
                                name={`variations.${index}.attributes.${attributeIndex}.value_attribute`}
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Valor do atributo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Preto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />

                                {(attributes.length - 1) > attributeIndex && <div className="w-full bg-zinc-500 h-0.5 rounded-4xl my-4" />}

                            </div>
                        ))}
                        <FormMessage />

                        <Button onClick={()=>
                            appendAttributes({name_attribute: "", value_attribute: ""}
                        )} 
                        type="button" className="cursor-pointer mt-5" 
                        >
                            <Plus size={16} /> 
                            Adicionar atributos
                        </Button>

                    </FormItem>
                )}
                />

            </CardContent>
        </Card>
    )
}