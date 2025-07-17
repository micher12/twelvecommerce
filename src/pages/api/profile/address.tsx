import { useAddressInterface } from "@/interfaces/use-address-interface";
import admin from "@/lib/AdminAuth";
import { connection } from "@/models/connection";
import { NextApiRequest, NextApiResponse } from "next";

export default async function profileAddress(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "GET"){

        const cookie = req.headers.cookie;

        if(!cookie) return res.status(400).json({erro: "Sessão inválida!"})

        const sessionToken = cookie.split("session=")[1].split(";")[0];

        if(!sessionToken) return res.status(400).json({erro: "Sessão inválida!"})

        const decoded = await admin.auth().verifySessionCookie(sessionToken);

        if(!decoded) return res.status(400).json({erro: "Sessão inválida!"})

        const address = await connection<useAddressInterface[]>("select  id_address, cep_address, street_address, district_address, number_address, complet_address, city_address, country_address from addresses WHERE uid_user = ?", [decoded.uid])


        return res.status(200).json({sucesso: "ok", address})
    }

}