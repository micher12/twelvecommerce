"use server";

import admin from "@/lib/AdminAuth";
import { cookies } from "next/headers";
import { connectionAdmin } from "./connectionAdmin";
import { useUserInterface } from "@/interfaces/use-user-interface";

export async function AuthGoogleLogin(token: string){

    try {

        const time = 1000 * 60 * 60 * 24 * 7;   

        const decoded = await admin.auth().verifyIdToken(token);
        const thisUser = await admin.auth().getUser(decoded.uid);

        const [users, sessionToken, cookie] = await Promise.all([
            connectionAdmin<useUserInterface[]>("SELECT * FROM users WHERE email_user = ?",[decoded.email as string]),
            admin.auth().createSessionCookie(token, {expiresIn: time}),
            cookies()
        ])

        if(!users.length){
            await connectionAdmin("INSERT INTO users (name_user, email_user, phone_user, password_user, createdat, uid_user) VALUES(?,?,?,?,?,?)", [thisUser.displayName as string,decoded.email as string,"null","google", new Date().toISOString(), decoded.uid])
        }

        cookie.set("session",sessionToken, {
            maxAge: time / 100,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/"
        })

        return "ok";

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;
        console.log(message);

        return "Algo deu errado!";
    }
}