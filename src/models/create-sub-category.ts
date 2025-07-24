"use server";

import { useSubCategoryInterface } from "@/interfaces/use-sub-category-interface";
import { connectionAdmin } from "./connectionAdmin";

export async function createSubCategory(data: {name_subcategory: string, id_category: number}){

    try {
        const id_subcategory = await connectionAdmin<useSubCategoryInterface[]>("INSERT INTO subcategorys (name_subcategory, id_category) values(?,?) RETURNING id_subcategory", [data.name_subcategory, data.id_category.toString()]).then(res => res?.[0].id_subcategory);

        return {sucesso: "ok", id_subcategory};
    } catch (error) {
        console.log(error);
        return {erro: "Algo deu errado!"};
    }
}