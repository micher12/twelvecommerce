"use server";

import { sendmail } from "./sendmail";

export async function verifyEmail(email: string){
    
    const codeVerify = await sendmail(email);

    return codeVerify;
}