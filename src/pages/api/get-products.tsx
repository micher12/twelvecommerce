"use server";

import { NextApiRequest, NextApiResponse } from "next";

export default async function getProducts(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "GET"){

        

    }

    return res.status(405).json({erro: "Metódo inválido!"});

}