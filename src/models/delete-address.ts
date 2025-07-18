"use server";

import admin from "@/lib/AdminAuth";
import { cookies } from "next/headers";
import { connection } from "./connection";
import { connectionAdmin } from "./connectionAdmin";

interface requestAddressesId{
    id_address: number
}

export async function deleteAddress(idAddress: number){
    try {

        const cookie = await cookies();

        const session = cookie.get("session");

        if(!session)
            throw new Error("Sessão inválida");

        const decoded = await admin.auth().verifySessionCookie(session.value);

        if(!decoded)
            throw new Error("Sessão expirada!");

        const uid = decoded.uid;

        const id_addresses = await connection<requestAddressesId[]>("SELECT id_address from addresses WHERE uid_user = ?", [uid]);

        if(!id_addresses?.length)
            throw new Error("Acesso negado!");

        const real_idAddress = id_addresses.find(id => id.id_address === idAddress)?.id_address;

        if(!real_idAddress)
            throw new Error("Acesso negado!");

        await connectionAdmin("DELETE FROM addresses WHERE id_address = ?", [real_idAddress.toString()]);

        return "sucesso";

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;

        if(message === "Sessão inválida")
            return message;

        if(message === "Sessão expirada!")
            return message;

        if(message === "Acesso negado!")
            return message;

        return "Algo deu errado!";
    }
}