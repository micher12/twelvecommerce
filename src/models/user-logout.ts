"use server";

import { cookies } from "next/headers";

export async function AuthUserLogOut(){

    const cookie = await cookies();

    cookie.delete("session");

    return "ok"
}