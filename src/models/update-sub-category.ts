"use server";

import { connectionAdmin } from "./connectionAdmin";

export async function updateSubCategory({id_subcategory, name_subcategory, id_category}: {id_subcategory: number, name_subcategory: string, id_category: number}){

    try {
        
        await connectionAdmin("UPDATE subcategorys set name_subcategory = ?, id_category = ? WHERE id_subcategory = ?", [name_subcategory, id_category.toString(), id_subcategory.toString()]);

        return {sucesso: "ok", name_subcategory, id_category};
    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado!"};
    }

}