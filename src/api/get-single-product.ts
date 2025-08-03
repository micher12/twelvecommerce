"use server";

import { useSingleProductInterface } from "@/interfaces/use-single-product";
import { connection } from "@/models/connection";

type dataProps = {
    id_product: number
}

export async function getSingleProduct({id_product}: dataProps){

    const query = `
        SELECT
        -- Dados do produto
        p.id_product,
        p.id_category,
        p.id_subcategory,
        p.name_product,
        p.description_product,
        p.price_product,
        p.star_product,
        p.createdat,

        -- Dados da variação
        v.id_variation,
        v.price_variation,
        v.amount_variation,

        -- Atributos agrupados em JSON
        json_group_array(
            json_object(
            'name_attribute', a.name_attribute,
            'value_attribute', va.value_attribute
            )
        ) AS attributes

        FROM products AS p
        LEFT JOIN variations AS v ON p.id_product = v.id_product
        LEFT JOIN combination_variation AS cv ON v.id_variation = cv.id_variation
        LEFT JOIN attributes_values AS va ON cv.id_attribute_value = va.id_attribute_value
        LEFT JOIN attributes AS a ON va.id_attribute = a.id_attribute

        WHERE p.id_product = ?

        GROUP BY v.id_variation
    `;


    try {
        const res = await connection<useSingleProductInterface[]>(query, [id_product.toString()]) as useSingleProductInterface[];

        return {sucesso: "ok", product: res};
    } catch (error) {
        console.log(error);
        return {erro: "Algo deu errado!"};
    }
}