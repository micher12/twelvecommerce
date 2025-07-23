"use server"

import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { connection } from "./connection";
import { connectionAdmin } from "./connectionAdmin";

export async function updateCategory(data: useCategoryInterface){


    try {
        const res = await connection<useCategoryInterface[]>("SELECT id_category from categorys WHERE id_category = ?", [data.id_category.toString()]).then(res => res?.[0].id_category);

        if(!res)
            throw new Error("ID não encontrado");

        const id_category = await connectionAdmin<useCategoryInterface[]>("UPDATE categorys set name_category = ? WHERE id_category = ? RETURNING id_category", [data.name_category, data.id_category.toString()]).then(res => res?.[0].id_category);

        return {sucesso: "ok", id_category}

    } catch (error) {
        console.log(error);

        const erro = error as Error;
        const message = erro.message;
        if(message.includes("Cannot read properties of undefined (reading 'id_category')"))
            return {erro: "ID não encontrado!"}
        if(message.includes("ID não encontrado"))
            return {erro: message}

        return {erro: "Algo deu errado."};
    }

}