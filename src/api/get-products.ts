"use server";

import { useProductInterface } from "@/interfaces/use-product-interface";
import { connection } from "@/models/connection";

export async function getProducts({category, subcategory, page = 1, limit = 10}: {category: string | undefined, subcategory: string | undefined, page?: number, limit?: number}){

    const params = [];
    let query = 'SELECT * FROM products';
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

    query += ` ORDER BY createdat DESC LIMIT ${(page-1) * limit}, ${limit}`;


    try {
        const res = await connection<useProductInterface[]>(query, params) as useProductInterface[];

        const response = await connection<{"count(id_product)": number}[]>(`SELECT count(id_product) from products`).then(res => res?.[0]["count(id_product)"]);

        const count = Math.ceil((response as number) / limit);

        return {sucesso: "ok", products: res, count};
    } catch (error) {
        console.log(error);
        return {erro: "Algo deu errado!"};
    }
}