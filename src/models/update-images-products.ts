"use server";

import { connectionAdmin } from "./connectionAdmin";

interface updateImagesProductsProps{
    id_product: number;
    urls: string[]
}

export async function updateImagesProducts({id_product, urls}: updateImagesProductsProps){

    try {
        
        await connectionAdmin("UPDATE products set urls_product = ? WHERE id_product = ?", [JSON.stringify(urls), id_product.toString()])

        return {sucesso: "ok"};

    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado"};
    }


}