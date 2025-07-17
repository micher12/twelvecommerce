"use server";

import { useAddressInterface } from "@/interfaces/use-address-interface";
import admin from "@/lib/AdminAuth";
import { cookies } from "next/headers";
import { connectionAdmin } from "./connectionAdmin";
import { connection } from "./connection";

const requestStore: Record<string, {count: number, date: number}> = {};

export async function updateAddress(address: useAddressInterface){

    try {

        const cookie = await cookies();

        const session = cookie.get("session");

        if(!session)
            return { erro: "Sessão Inválida!" }

        function verificarAcesso(sessions: string): boolean {
            const agora = Date.now();
            const ultimoAcesso = requestStore[sessions];

            if(ultimoAcesso && (agora - ultimoAcesso.date > 5 * 60 * 1000)){
                requestStore[sessions] = {count: 1, date: agora};
            }

            if (ultimoAcesso && ultimoAcesso.count > 3) {
                return false; 
            }

            if(ultimoAcesso){
                requestStore[sessions] = {count: requestStore[sessions].count + 1, date: requestStore[sessions].date};
            }else{
                requestStore[sessions] = {count: 1, date: agora};
            }

            return true; 
        }

        if(!verificarAcesso(session?.value as string))
            return { erro: "Tente novamente em 5 minuto." }

        const decoded = await admin.auth().verifySessionCookie(session.value);

        if(!decoded)
            return { erro: "Sessão inválida!" }

        const uid = decoded.uid;

        const id_address = await connection<{id_address: number}[]>("SELECT id_address from addresses WHERE uid_user = ?", [uid]);

        if(!id_address) return { erro: "Acesso negado!" }

        const real_id_address = id_address.find((val) => val.id_address === address.id_address)?.id_address;

        if(!real_id_address) return { erro: "Acesso negado!" }

        await connectionAdmin("UPDATE addresses set cep_address = ?, street_address = ?, district_address = ?, number_address = ?, complet_address = ?, city_address = ?, country_address = ? WHERE id_address = ? ", [address.cep_address, address.street_address, address.district_address, address.number_address.toString(), address.complet_address, address.city_address, address.country_address, real_id_address.toString()])

        return {sucesso: "ok"};

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;

        console.log(message);

        return {erro: "Algo deu errado"};
    }

}