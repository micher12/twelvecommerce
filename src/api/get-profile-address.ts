"use server";

import { useAddressInterface } from "@/interfaces/use-address-interface";
import admin from "@/lib/AdminAuth";
import { connection } from "@/models/connection";
import { cookies } from "next/headers";

export async function getProfileAddress(){

    const cookie = await cookies();

    const sessionToken = cookie.get("session")?.value;

    if(!sessionToken) return {erro: "Sessão inválida!"};

    const decoded = await admin.auth().verifySessionCookie(sessionToken);

    if(!decoded) return {erro: "Sessão inválida!"}

    const address = await connection<useAddressInterface[]>("select  id_address, cep_address, street_address, district_address, number_address, complet_address, city_address, country_address from addresses WHERE uid_user = ?", [decoded.uid])

    return {sucesso: "ok", address};

}