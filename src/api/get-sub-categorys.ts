"use server";

import { useSubCategoryInterface } from "@/interfaces/use-sub-category-interface";
import { connection } from "@/models/connection";

export async function getSubCategorys(){
    
    try {
        const res = connection<useSubCategoryInterface[]>("SELECT * from subcategorys ORDER BY name_subcategory");

        return {sucesso: "ok", res}
    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado!"};
    }
}