"use server";

import { useProductInterface } from "@/interfaces/use-product-interface";
import { connection } from "@/models/connection";

export async function getProducts({category, subcategory}: {category: string | undefined, subcategory: string | undefined}){

    const params = [];
    let query = 'SELECT * FROM products ORDER BY createdat DESC';
    const conditions = [];

    if (category !== undefined) {
        conditions.push('id_category = ?');
        params.push(category);
    }

    if (subcategory !== undefined) {
        conditions.push('id_subcategory = ?');
        params.push(subcategory);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const res = await connection<useProductInterface[]>(query, params) as useProductInterface[];

        return {sucesso: "ok", products: res};
    } catch (error) {
        console.log(error);
        return {erro: "Algo deu errado!"};
    }
}