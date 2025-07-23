import { NewCategoryForm } from "@/components/(admin)/category/new-category-form";

export default function NewCategory(){
    return(
        <div>
            <h2 className="text-3xl font-bold mb-5">Cadastrar categoria: </h2>
            <NewCategoryForm />
        </div>
    )
}