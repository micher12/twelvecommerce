"use server";

import { useUserInterface } from "@/interfaces/use-user-interface";
import admin from "@/lib/AdminAuth";
import { connection } from "@/models/connection";
import { cookies } from "next/headers";

export async function getProfile(){

    const cookie = await cookies();

    if(!cookie) return {erro: "Sessão inválida!"};

    const session = cookie.get("session")?.value;

    if(!session) return {erro: "Sessão inválida!"};


    try {
        const decoded = await admin.auth().verifySessionCookie(session);

        if(!decoded) return {erro: "Sessão inválida!"};

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

        const thisUser = user as useUserInterface;

        return {sucesso: "ok", user: thisUser};

    } catch (error) {
        console.log(error);
        return {erro: "Sessão inválida!"}
    }

}