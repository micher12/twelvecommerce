"use server";

import { getQueryClient } from "@/lib/getQueryClient";
import { connectionAdmin } from "./connectionAdmin";

export async function deleteVariation(id_variation: number, id_product: number){
    
    try {
        const [id_attribute_values] = await Promise.all([
            connectionAdmin<{id_attribute_value:number}[]>("SELECT id_attribute_value from combination_variation WHERE id_variation = ?", 
            [id_variation.toString()]
            ),
            connectionAdmin("DELETE FROM variations WHERE id_variation = ? ", [id_variation.toString()])
        ])

        const query = `DELETE FROM attributes_values WHERE id_attribute_value IN (${id_attribute_values.flatMap(()=> "?")})`

        const params: string[] = id_attribute_values.map((val)=> val.id_attribute_value.toString());

        await connectionAdmin(query, params);

        const queryClient = getQueryClient();
        
        await queryClient.invalidateQueries({queryKey: ["single-product", id_product]})

        return {sucesso: "ok"};

    } catch (error) {    
        console.log(error);

        return {erro: "Algo deu errado!"};
    }

}