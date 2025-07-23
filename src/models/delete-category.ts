"use server";

import { connectionAdmin } from "./connectionAdmin";

export async function deleteCategory(id_category: number){

    try {
        
        await connectionAdmin("DELETE FROM categorys WHERE id_category = ?", [id_category.toString()]);

        return {sucesso: "ok"};

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;
        
        return {erro: message};
    }

}