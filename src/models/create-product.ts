"use server";

import { useProductInterface } from "@/interfaces/use-product-interface";
import { useVariationInterface } from "@/interfaces/use-variation-interface";
import { connectionAdmin } from "./connectionAdmin";

interface CreateProductProps {
    product: useProductInterface;
    variations: useVariationInterface[];
}

type responseVariation = {
    id_variation: number
    insertion_order: number,
}
type responseAttribute = {
    id_attribute: number
    name_attribute: string
}

type responseAttributeValues = {
    id_attribute_value: number
    value_attribute: string
}

export async function createProduct({ product, variations }: CreateProductProps) {

    try {

        const id_subcategory = product.id_subcategory === 0 ? "null" : product.id_subcategory.toString();
        const date = new Date().toISOString();

        // Adicionar produto
        const productSql = `INSERT INTO products (id_category, id_subcategory, name_product, description_product, price_product, star_product, createdat) 
                            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id_product`;

        const paramsProducts = [
            product.id_category.toString(),
            id_subcategory,
            product.name_product,
            product.description_product,
            product.price_product.toString(),
            product.star_product.toString(),
            date,
        ];

        const [{ id_product }] = await connectionAdmin<useProductInterface[]>(productSql, paramsProducts);

        const attributeSet = new Set<string>();
        const attributeValuePairs = new Set<string>();

        for (const { attributes } of variations) {
            for (const { name_attribute, value_attribute } of attributes) {
                attributeSet.add(name_attribute.trim());
                attributeValuePairs.add(`${name_attribute.trim()}|||${value_attribute}`);
            }
        }

        const attributeList = [...attributeSet];
        const attributeValueList = [...attributeValuePairs].map((pair) => {
            const [name, value] = pair.split("|||");
            return { name, value };
        });

        const attrPlaceholders = attributeList.map(() => "(?)").join(", ");
        
        const varPlaceholders = variations.map(() => "(?, ?, ?, ?)").join(", ");
        const varParams = variations.flatMap((v, i) => [
            id_product.toString(),
            v.price_variation.toString(),
            v.amount_variation.toString(),
            i.toString()
        ]);

        // Criando variation e tentando adicionar atributo.
        const [insertedVars] = await Promise.all([
            connectionAdmin<responseVariation[]>(
                `INSERT INTO variations (id_product, price_variation, amount_variation, insertion_order) VALUES ${varPlaceholders} RETURNING id_variation, insertion_order`,
                varParams
            ),
            connectionAdmin(`INSERT OR IGNORE INTO attributes (name_attribute) VALUES ${attrPlaceholders}`, attributeList)
        ]);


        const attrs = await connectionAdmin<responseAttribute[]>(
            `SELECT * FROM attributes WHERE name_attribute IN (${attributeList.map(() => "?").join(", ")})`,
            attributeList
        );
        const attrMap = new Map(attrs.map(({ name_attribute, id_attribute }) => [name_attribute, id_attribute]));

        const valuePlaceholders = attributeValueList.map(() => "(?, ?)").join(", ");
        const valueParams = attributeValueList.flatMap(({ name, value }) => {
            const thisName = attrMap.get(name);
            if(thisName)
                return [thisName.toString(), value]
            else
                return[]
        }); 

        

        const attrValues = await connectionAdmin<responseAttributeValues[]>(
            `INSERT INTO attributes_values (id_attribute, value_attribute) VALUES ${valuePlaceholders} 
            RETURNING id_attribute_value, value_attribute`
            , valueParams
        );

        const attrValueMap = new Map(attrValues.map(val => [val.value_attribute, val.id_attribute_value]));
        
        const comboPlaceholders: string[] = [];
        const comboParams: string[] = [];

        // Ordenando para garantir inserção na mesma ordem.
        insertedVars.sort((a, b) => a.insertion_order - b.insertion_order);

        variations.forEach((variation, index) => {
            const id_variation = insertedVars[index].id_variation.toString();
            for (const { value_attribute } of variation.attributes) {
                const id_attr_value = attrValueMap.get(value_attribute)?.toString();
                if (id_attr_value) {
                    comboPlaceholders.push("(?, ?)");
                    comboParams.push(id_variation, id_attr_value);
                }
            }
        });

        await connectionAdmin(
            `INSERT INTO combination_variation (id_variation, id_attribute_value) VALUES ${comboPlaceholders.join(", ")}`,
            comboParams
        );

        return {sucesso: "ok", id_product}

    } catch (error) {
        console.log(error);

        return {erro: "Algo deu errado!"}
    }

}