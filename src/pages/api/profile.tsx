import { useUserInterface } from "@/interfaces/use-user-interface";
import admin from "@/lib/AdminAuth";
import { connection } from "@/models/connection";
import { NextApiRequest, NextApiResponse } from "next";

export default async function profile(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "GET"){

        const cookie = req.headers.cookie;

        if(!cookie) return res.status(400).json({erro: "Inválido!"})

        if(!cookie.includes("session")) return res.status(400).json({erro: "Inválido!"})

        const session = cookie.split("session=")[1].split(";")[0];

        try {
            const decoded = await admin.auth().verifySessionCookie(session);

            const preUser = await connection<useUserInterface[]>("SELECT name_user, email_user, phone_user, password_user, createdat from users WHERE email_user = ?", [decoded.email as string]).then(res => res?.[0]);

            let user;

            if(preUser?.password_user?.toString() === "google")
                user = {
                    id_user: preUser?.id_user,
                    name_user: preUser?.name_user,
                    email_user: preUser?.email_user,
                    phone_user: preUser?.phone_user,
                    password_user: preUser?.password_user,
                }
            else
                user = {
                    id_user: preUser?.id_user,
                    name_user: preUser?.name_user,
                    email_user: preUser?.email_user,
                    phone_user: preUser?.phone_user,
                }

            return res.status(200).json({sucesso: "ok", user})

        } catch (error) {
            console.log(error);
            return res.status(400).json({erro: "Inválido!"})
        }

    }

}