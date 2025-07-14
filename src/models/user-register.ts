"use server";

import admin from "@/lib/AdminAuth";
import { createHash } from "crypto";
import { connectionAdmin } from "./connectionAdmin";
import { sendmail } from "./sendmail";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { cookies } from "next/headers";

type formProps = {
    name: string;
    email: string;
    phone: string;
    password: string;
    remember: boolean;
    politics: boolean;
}

export async function AuthUserRegister({ name, email, password, phone, remember }:formProps){

    try {

        const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string) as FirebaseOptions;

        let app: FirebaseApp;

        try {
            app = getApp();
        } catch {
            app = initializeApp(firebaseConfig);
        }

        const finalNumber = "+55"+phone.replace(/[()\s-]/g, "");

        const user = await admin.auth().createUser({
            displayName: name,
            email: email,
            phoneNumber: finalNumber,
            password: password,
        })

        const auth = getAuth(app);

    
        const thisPassword = `${password}${process.env.PASSWORD_HASH}`;

        const encodedPassword = createHash("sha256").update(thisPassword).digest("base64");

        const connection = connectionAdmin("INSERT INTO user (name_user, email_user, phone_user, password_user, createdat) VALUES(?,?,?,?,?)", [name, email, phone, encodedPassword, new Date().toISOString()]);

        const signIn = signInWithEmailAndPassword(auth, user.email as string, password);

        const [ _, userCredential ] = await Promise.all([
            await connection,
            await signIn
        ])

        const token = await userCredential.user.getIdToken();

        const time = 1000 * 60 * 60 * 24 * 7;

        const sessionCookie = await admin.auth().createSessionCookie(token, {expiresIn: time});

        const cookie = await cookies();

        if(!remember){
            cookie.set("session", sessionCookie, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict"
            })
            
            return "ok";
        }

        cookie.set("session", sessionCookie, {
            maxAge: time / 1000,
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict"
        })

        return "ok";

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;

        console.log(message)

        if(message.includes("The email address is improperly formatted."))
            return "Email inválido!";

        if(message.includes("The email address is already in use by another account."))
            return "Email já está em uso!"

        return "Algo deu errado";
    }

}