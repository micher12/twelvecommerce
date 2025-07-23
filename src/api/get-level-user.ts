"use server";

import { useUserInterface } from "@/interfaces/use-user-interface";
import admin from "@/lib/AdminAuth";
import { connection } from "@/models/connection";
import { cookies } from "next/headers";

export async function getLevelUser(){
    const cookie = await cookies();

    const sessionToken = cookie.get("session")?.value;

    if(!sessionToken) return 0;
    
    const decoded = await admin.auth().verifySessionCookie(sessionToken)

    if(!decoded) return 0;

    const uid = decoded.uid;

    const level = await connection<useUserInterface[]>("SELECT level_user from users WHERE uid_user = ?", [uid]).then(res => res?.[0].level_user);

    if(!level || level < 1) return 0;

    return level;
    
}