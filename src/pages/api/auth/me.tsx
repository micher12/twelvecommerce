"use sever";

import admin from "@/lib/AdminAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function me(req: NextApiRequest, res: NextApiResponse){

    if(req.method !== "GET")
        return res.status(405).json({erro: "Método inválido!"});

    const session = req.headers.cookie;

    if(!session)
        return res.status(400).json({erro: "Sessão inválida!"});

    try {

        const decoded = await admin.auth().verifySessionCookie(session, true);

        return res.status(200).json({sucesso: "ok", uid: decoded.uid});

    } catch (error) {
        console.log(error);

        return res.status(401).json({erro: "Sessão inválida ou expirada!"});
    }
}