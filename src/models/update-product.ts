"use server";

import { VariationChange } from "@/interfaces/modified-attributes";
import { connectionAdmin } from "./connectionAdmin";

interface updateProps {
    id: number
    changes: {
        key: string;
        newValue: string;
    }[]
    variations: VariationChange[]
}


export async function updateProduct({id, changes, variations}: updateProps){

    if(!changes.length && !variations.length)
        return {warning: "Nenhum dado foi modificado!"}

    const promises = [];

    try{

        
        if(changes.length){
            //atualizar produto;

            const placeholder: string[] = [];
            const params: string[] = [];

            changes.forEach((values)=>{
                placeholder.push(`${values.key} = ?`)
                params.push(values.newValue);
            })

            const query = `UPDATE products SET ${placeholder.join(", ")} WHERE id_product = ?`;
            params.push(id.toString());

            promises.push(connectionAdmin(query, params));
        }

        if(variations.length){
            //atualizar atributos

            const variationPlaceholder: string[] = [];
            const finalQuery: string[] = [];
            const finalParams: string[][] = [];
            let new_id_variation = 0;


            let index = 0;
            for(const data of variations){
                //atualizar variações: 

                const params = [];
                if(data.price_variation){
                    variationPlaceholder.push(`price_variation = ?`);
                    params.push(`${data.price_variation.toString()}`);
                }
                    
                if(data.amount_variation){
                    variationPlaceholder.push(`amount_variation = ?`);
                    params.push(`${data.amount_variation.toString()}`);
                }

                if(variationPlaceholder.length > 0 && data.id_variation !== 0){
                    const query = `UPDATE variations SET ${variationPlaceholder.join(", ")} WHERE id_variation = ?;`
                    params.push(data.id_variation.toString());

                    finalQuery.push(query);
                    finalParams.push(params);
                    variationPlaceholder.length = 0;
                }


                if(variationPlaceholder.length > 0 && data.id_variation === 0){
                    const query = `INSERT INTO variations (id_product, price_variation, amount_variation, insertion_order) VALUES(?,?,?,?) returning id_variation`
                    params.push(index.toString());
                    params.unshift(id.toString());

                    new_id_variation = await connectionAdmin<{id_variation: number}[]>(query,params).then(res => res?.[0].id_variation);

                    variationPlaceholder.length = 0;
                }

                index++;
                
                // Atualizar atributos da variação: 
                if(data.attributes?.length){

                    for(const attribute of data.attributes){

                        if(attribute.old){

                            let new_id_attribute = null;
                            let old_id_attribute = null;

                            if(attribute.old.name_attribute !== attribute.new.name_attribute) {
                                // criar novo atributo.

                                await connectionAdmin("INSERT OR IGNORE INTO attributes (name_attribute) VALUES (?) returning id_attribute", 
                                    [attribute.new.name_attribute.trim()]
                                )

                                new_id_attribute = await connectionAdmin<{id_attribute:number, name_attribute: string}[]>("SELECT id_attribute from attributes WHERE name_attribute = ?", 
                                    [attribute.new.name_attribute]
                                ).then(res => res?.[0].id_attribute);

                            }

                            old_id_attribute = await connectionAdmin<{id_attribute:number, name_attribute: string}[]>("SELECT id_attribute from attributes WHERE name_attribute = ?", 
                                [attribute.old.name_attribute]
                            ).then(res => res?.[0].id_attribute);
                        

                            const idAttributesValues = await connectionAdmin<{id_attribute_value: number}[]>("SELECT id_attribute_value from combination_variation WHERE id_variation = ?", 
                                [data.id_variation.toString()]
                            );

                            const getIdAttributeValue = `SELECT id_attribute_value from attributes_values WHERE id_attribute_value IN (${idAttributesValues.map(()=> "?" ).join(", ")}) AND id_attribute = ?`;
                            
                            const id_attribute_value = await connectionAdmin<{id_attribute_value: number}[]>(getIdAttributeValue, [
                                ...idAttributesValues.map((item)=> item.id_attribute_value.toString()),
                                old_id_attribute.toString()
                            ]).then(res => res?.[0].id_attribute_value);

                            const placeholder: string[] = [];
                            const params: string[] = [];

                            if(new_id_attribute){
                                placeholder.push("id_attribute = ?");
                                params.push(new_id_attribute.toString());
                            }

                            placeholder.push("value_attribute = ?");
                            params.push(attribute.new.value_attribute);

                            const query = `UPDATE attributes_values SET ${placeholder.join(", ")} WHERE id_attribute_value = ?`
                            params.push(id_attribute_value.toString());
                            promises.push(connectionAdmin(query, params));

                            continue;
                        }

                        if(attribute.new){

                            if(!attribute.old){
                                // Novo atributo
  
                                await connectionAdmin("INSERT OR IGNORE INTO attributes (name_attribute) VALUES (?)", 
                                    [attribute.new.name_attribute.trim()]
                                )
                            }

    
                            const id_attribute = await connectionAdmin<{id_attribute:number, name_attribute: string}[]>("SELECT id_attribute from attributes WHERE name_attribute = ?", 
                                [attribute.new.name_attribute]
                            ).then(res => res?.[0].id_attribute);
                    

                            const placeholderAttributesValues = `INSERT INTO attributes_values (id_attribute, value_attribute) VALUES(?,?) returning id_attribute_value`;
                            const paramsAttributeValues = [id_attribute.toString(), attribute.new.value_attribute];

                            const id_attribute_value = await connectionAdmin<{id_attribute_value: number}[]>(placeholderAttributesValues, paramsAttributeValues)
                            .then(res => res?.[0].id_attribute_value)
                            
                            if(data.id_variation !== 0)
                                promises.push(connectionAdmin(`INSERT INTO combination_variation (id_variation, id_attribute_value) VALUES (?,?)`,
                                    [data.id_variation.toString(), id_attribute_value.toString()]
                                ));
                            
                            if(data.id_variation === 0)
                                promises.push(connectionAdmin(`INSERT INTO combination_variation (id_variation, id_attribute_value) VALUES (?,?)`,
                                    [new_id_variation.toString(), id_attribute_value.toString()]
                                ));

                        }
                        
                    }

                }
                

            }

            if(finalQuery.length > 0){
                finalQuery.forEach((query, index)=>{
                    promises.unshift(connectionAdmin(query, finalParams[index]));
                })
            }
            
        }
        
        await Promise.all(promises);

        return {sucesso: "ok"};

    } catch(error){
        console.log(error);
        return {erro: "Algo deu errado!"};
    }

}