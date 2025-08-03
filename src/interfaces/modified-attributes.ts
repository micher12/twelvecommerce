export interface AttributeChange {
    old?: {
        name_attribute: string;
        value_attribute: string;
    };
    new: {
        name_attribute: string;
        value_attribute: string;
    };
}

export interface VariationChange {
    id_variation: number;
    price_variation?: number;
    amount_variation?: number;
    attributes?: AttributeChange[];
}