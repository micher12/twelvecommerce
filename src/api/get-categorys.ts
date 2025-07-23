import { useCategoryInterface } from "@/interfaces/use-category-interface";
import { connection } from "@/models/connection";

export function getCategorys(){

    const res = connection<useCategoryInterface[]>("SELECT * from categorys ORDER BY name_category");

    return res

}