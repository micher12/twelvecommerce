import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleX, Plus, X } from "lucide-react";
import { InputNumber } from "primereact/inputnumber";
import { useFieldArray, UseFormReturn } from "react-hook-form";


interface VaritionsProps{
    form: UseFormReturn<{
        name_product: string;
        description_product: string;
        id_category: string;
        id_subcategory: string | null;
        price_product: number;
        star_product: boolean;
        files: unknown,
        variations: {
            price_variation: number;
            amount_variation: number;
            attributes: {
                name_attribute: string;
                value_attribute: string;
            }[];
        }[];
    }>
    index: number,
    remove: (index: number)=> void;
}

export function CreateVariations({ form, index, remove }: VaritionsProps){

    const { fields: attributes, append: appendAttributes, remove: removeAttributes } = useFieldArray({control: form.control, name: `variations.${index}.attributes`})

    return(
        <Card className="w-full sm:w-[calc((100%/2)-16px)] lg:w-[calc((100%/3)-21.5px)]">
            <CardContent className="flex flex-col gap-3">
                <CardDescription className="flex items-center justify-between">
                    <div>{index+1}° Variação</div>
                    <div onClick={()=>remove(index)} className="cursor-pointer text-red-400/80 hover:text-red-400"><CircleX/></div>
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
                render={()=>(
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
                                                <Button
                                                type="button"
                                                size={"sm"}
                                                variant={"ghost"}
                                                className="bg-red-400/80 hover:bg-red-400! focus:bg-red-400/80 font-semibold w-6 h-5 cursor-pointer"
                                                onClick={()=>removeAttributes(attributeIndex)}
                                                >
                                                    <X size={16} />
                                                </Button>
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