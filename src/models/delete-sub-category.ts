"use server";

import { connectionAdmin } from "./connectionAdmin";

export async function deleteSubCategory(id_subcategory: number){
    try {

        await connectionAdmin("DELETE FROM subcategorys WHERE id_subcategory = ?", [id_subcategory.toString()]);

        return {sucesso: "ok"}
    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado!"};
    }

}