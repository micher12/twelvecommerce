import { useUserInterface } from "@/interfaces/use-user-interface";
import admin from "@/lib/AdminAuth";
import { connection } from "@/models/connection";
import { NextApiRequest, NextApiResponse } from "next";

export default async function user(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "GET"){

        const cookie = req.headers.cookie;

        if(!cookie) return res.status(400).json({erro: "Inválido!"})

        if(!cookie.includes("session")) return res.status(400).json({erro: "Inválido!"})

        const session = cookie.split("session=")[1].split(";")[0];

        try {
            const decoded = await admin.auth().verifySessionCookie(session);

            const user = await connection<useUserInterface[]>("SELECT * from user WHERE email_user = ?", [decoded.email as string]).then(res => res?.[0]);

            return res.status(200).json({sucesso: "ok", user})

        } catch (error) {
            console.log(error);
            return res.status(400).json({erro: "Inválido!"})
        }

    }

}