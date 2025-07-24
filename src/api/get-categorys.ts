"use server";

import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { connection } from "@/models/connection";

export async function getCategorys(){

    const res = await connection<useCategoryInterface[]>("SELECT * from categorys ORDER BY name_category");

    return res

}