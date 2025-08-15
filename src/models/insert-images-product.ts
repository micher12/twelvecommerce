"use server";

import { connectionAdmin } from "./connectionAdmin";

export async function insertImagesProduct(urls: string[], id_product: number){

    try {
        await connectionAdmin(`UPDATE products SET urls_product = ? WHERE id_product = ?`, 
            [JSON.stringify(urls), id_product.toString()]
        )

        return {sucesso: "ok", urls};
    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado!"};
    }

}