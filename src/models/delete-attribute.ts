"use server";

import { getQueryClient } from "@/lib/getQueryClient";
import { connectionAdmin } from "./connectionAdmin";


export async function deleteAttribute(
    id_variation: number, 
    attribute: {name_attribute: string, value_attribute: string},
    id_product: number,
){

    try {
        const [id_attribute_values, id_attribute] = await Promise.all([
            connectionAdmin<{id_attribute_value: number}[]>("SELECT id_attribute_value from combination_variation WHERE id_variation = ?", [id_variation.toString()]),
            connectionAdmin<{id_attribute: number}[]>("SELECT id_attribute from attributes WHERE name_attribute = ?", 
                [attribute.name_attribute]
            ).then(res => res?.[0].id_attribute)
        ])

        const query = `DELETE FROM attributes_values WHERE id_attribute_value IN (${id_attribute_values.flatMap(()=> "?")}) AND id_attribute = ?`;
        const params = id_attribute_values.flatMap((val)=> val.id_attribute_value.toString())
        params.push(id_attribute.toString());

        await connectionAdmin(query, params);

        const queryClient = getQueryClient();

        await queryClient.invalidateQueries({queryKey: ["single-product", id_product]})

        return {sucesso: "ok"};
    } catch (error) {
        console.log(error);
        return {erro: "Algo deu errado!"};   
    }
}