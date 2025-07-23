"use server";

import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { connection } from "@/models/connection";
import { connectionAdmin } from "@/models/connectionAdmin";

export async function createCategory({name_category}: useCategoryInterface){

    const res = await connection<useCategoryInterface[]>("SELECT name_category from categorys WHERE name_category = ?",[name_category]);

    if(res?.length) return {erro: "Categoria já cadastrada!"}

    const id_category = await connectionAdmin<useCategoryInterface[]>("INSERT INTO categorys (name_category) values (?) RETURNING id_category",[name_category])
    .then(res => res[0].id_category);

    return {sucesso: "ok", id_category}

}