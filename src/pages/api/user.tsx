import admin from "@/lib/AdminAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function user(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "GET"){

        const cookie = req.headers.cookie;

        if(!cookie) return res.status(400).json({erro: "Inválido!"})

        if(!cookie.includes("session")) return res.status(400).json({erro: "Inválido!"})

        const session = cookie.split("session=")[1].split(";")[0];

        try {
            const decoded = await admin.auth().verifySessionCookie(session);

            const user = await admin.auth().getUser(decoded.uid);

            return res.status(200).json({sucesso: "ok", user})

        } catch (error) {
            return res.status(400).json({erro: "Inválido!"})
        }

    }

}