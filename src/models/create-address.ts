"use server";

import { useAddressInterface } from "@/interfaces/use-address-interface";
import admin from "@/lib/AdminAuth";
import { cookies } from "next/headers";
import { connection } from "./connection";
import { connectionAdmin } from "./connectionAdmin";

export async function createAddress(address: useAddressInterface){

    try {
        
        const cookie = await cookies();

        const session = cookie.get("session");

        if(!session) throw new Error("createAddress: Sessão expirada!");

        const decoded = await admin.auth().verifySessionCookie(session.value);

        const uid = decoded.uid;

        const oldAddress = await connection<useAddressInterface[]>("SELECT cep_address from addresses WHERE uid_user = ?", [uid]);

        const hasAddress = oldAddress?.find(prev => prev.cep_address === address.cep_address);

        if(hasAddress?.cep_address)
            throw new Error("createAddress: CEP já cadastrado!");

        const id_address = await connectionAdmin<useAddressInterface[]>(`
            INSERT INTO 
            addresses
            (cep_address, street_address, number_address, complet_address, district_address, city_address, country_address, uid_user) 
            VALUES(?,?,?,?,?,?,?,?)
            RETURNING id_address;
        `, 
        [address.cep_address, address.street_address, address.number_address.toString(), address.complet_address, address.district_address, address.city_address, address.country_address, uid]
        ).then(res => res?.[0].id_address);

        return {sucesso: "ok", id: id_address};

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;

        if(message.includes("createAddress:"))
            return {erro: message.split("createAddress: ")[1]}

        return {erro: "Algo deu errado!"};
    }

}