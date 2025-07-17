"use server";

import { useUserInterface } from "@/interfaces/use-user-interface";
import { connection } from "./connection";
import { sendmail } from "./sendmail";
import { AES } from "crypto-js";
import jwt from "jsonwebtoken";

export async function verifyEmail(email: string){
    
    const hasAccount = await connection<useUserInterface[]>("SELECT id_user from users WHERE email_user = ?", [email]);

    if(hasAccount && hasAccount.length > 0)
        return null;

    const codeVerify = await sendmail(email);

    const codeEncrypted = AES.encrypt(codeVerify, process.env.PASSWORD_HASH as string).toString();

    const session = jwt.sign({purpose: "code_verify", password: codeEncrypted}, process.env.JWT_TOKEN as string, {expiresIn: "5 min"});

    return session;
}