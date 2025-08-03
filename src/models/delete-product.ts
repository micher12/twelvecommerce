"use server";

import { useProductInterface } from "@/interfaces/use-product-interface";
import { Row } from "@tanstack/react-table";
import { connectionAdmin } from "./connectionAdmin";

type realDataProps = {
    product: useProductInterface,
    name_category: string,
    name_subcategory: string,
}

type responseSelectQuery = {
    id_product: number,
    id_variation: number,
    id_attribute_value: number,
}

export async function deleteProduct(data: number | Row<realDataProps>[]){

    const dataIds = [];

    try {
        if(Array.isArray(data)){
            // é do tipo realData
            const params: string[] = [];
            const placeholder: string[] = [];

            data.map((item)=>{
                const thisData = item.original;

                dataIds.push(thisData.product.id_product);
                
                const id_product = thisData.product.id_product.toString()

                placeholder.push("?");
                params.push(id_product);
            })

            const selectQuery = `
                SELECT
                    p.id_product,
                    v.id_variation,
                    va.id_attribute_value
                from variations as v
                LEFT JOIN products AS p ON v.id_product = p.id_product
                LEFT JOIN combination_variation AS cv ON v.id_variation = cv.id_variation
                LEFT JOIN attributes_values AS va ON cv.id_attribute_value = va.id_attribute_value
                WHERE p.id_product IN (${placeholder.join(", ")})
                GROUP BY va.id_attribute_value
            `

            const responseIds = await connectionAdmin<responseSelectQuery[]>(selectQuery, params);

            // Não duplicar ids
            const productsIdSet = new Set<string>();
            const variationsIdSet = new Set<string>();
            const attributesValuesIdSet = new Set<string>();

            responseIds.map((item)=>{
                if (item.id_product != null) {
                    productsIdSet.add(item.id_product.toString());
                }
                if (item.id_variation != null) {
                    variationsIdSet.add(item.id_variation.toString());
                }
                if (item.id_attribute_value != null) {
                    attributesValuesIdSet.add(item.id_attribute_value.toString());
                }
            })

            // Converte Sets em Arrays
            const productsId = Array.from(productsIdSet);
            const variationsId = Array.from(variationsIdSet);
            const attributesValuesId = Array.from(attributesValuesIdSet);

            await Promise.all([
                connectionAdmin(`DELETE FROM products WHERE id_product IN (${productsId.flatMap(()=> "?")})`, productsId),
                connectionAdmin(`DELETE FROM variations WHERE id_variation IN (${variationsId.flatMap(()=> "?")})`, variationsId),
                connectionAdmin(`DELETE FROM attributes_values WHERE id_attribute_value IN (${attributesValuesId.flatMap(()=> "?")})`, attributesValuesId),

            ])
            
        }else{
            //excluir pelo id.

            dataIds.push(data);

            const query = `
                SELECT
                    p.id_product,
                    v.id_variation,
                    va.id_attribute_value
                from variations as v
                LEFT JOIN products AS p ON v.id_product = p.id_product
                LEFT JOIN combination_variation AS cv ON v.id_variation = cv.id_variation
                LEFT JOIN attributes_values AS va ON cv.id_attribute_value = va.id_attribute_value
                WHERE p.id_product IN (?)
                GROUP BY va.id_attribute_value
            `
            const responseIds = await connectionAdmin<responseSelectQuery[]>(query, [data.toString()]);

            // Não duplicar ids
            const productsIdSet = new Set<string>();
            const variationsIdSet = new Set<string>();
            const attributesValuesIdSet = new Set<string>();

            responseIds.map((item)=>{
                if (item.id_product != null) {
                    productsIdSet.add(item.id_product.toString());
                }
                if (item.id_variation != null) {
                    variationsIdSet.add(item.id_variation.toString());
                }
                if (item.id_attribute_value != null) {
                    attributesValuesIdSet.add(item.id_attribute_value.toString());
                }
            })

            // Converte Sets em Arrays
            const productsId = Array.from(productsIdSet);
            const variationsId = Array.from(variationsIdSet);
            const attributesValuesId = Array.from(attributesValuesIdSet);

            await Promise.all([
                connectionAdmin(`DELETE FROM products WHERE id_product IN (${productsId.flatMap(()=> "?")})`, productsId),
                connectionAdmin(`DELETE FROM variations WHERE id_variation IN (${variationsId.flatMap(()=> "?")})`, variationsId),
                connectionAdmin(`DELETE FROM attributes_values WHERE id_attribute_value IN (${attributesValuesId.flatMap(()=> "?")})`, attributesValuesId),

            ])
        }

        return {sucesso: "ok", dataIds}

    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado!"}
    }

}