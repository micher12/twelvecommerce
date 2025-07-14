"use server";

import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import admin from "@/lib/AdminAuth";
import { cookies } from "next/headers";

export async function AuthUserLogin(email: string, password: string, remember: boolean){

    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string) as FirebaseOptions;

    let app: FirebaseApp;

    try {
        app = getApp();
    } catch {
        app = initializeApp(firebaseConfig);
    }

    const auth = getAuth(app);

    try {
        
        const cookie = await cookies();

        const hasSession = cookie.get("session");

        if(hasSession) return "ok";

        const id = await signInWithEmailAndPassword(auth, email, password)
        .then(async(res) => {
            if(res){
                return await res.user.getIdToken();
            }

            return null;
        });

        if(!id) throw new Error("auth/invalid-credential");

        const time = 1000 * 60 * 60 * 24 * 7; // 7 dias

        const sessionCookie = await admin.auth().createSessionCookie(id, {expiresIn: time});

        
        if(!remember){
            cookie.set("session", sessionCookie, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/"
            })

            return "ok";
        }

        cookie.set("session", sessionCookie, {
            maxAge: time / 1000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/"
        })
    
        return "ok";

    } catch (error) {
        const erro = error as Error;
        console.log(erro.message);

        if(erro.message.includes("auth/invalid-credential"))
            return "Email ou senha inválido!";

        return "Algo deu errado!"
    }

}