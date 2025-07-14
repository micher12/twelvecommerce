"use server";

import Cloudflare from "cloudflare";

export async function connection<T>(sql: string, params: string[] | undefined = undefined){

    try {
        const client = new Cloudflare({
            apiToken: process.env.CLOUDFLARE_ONLYREAD
        });

        const result = await client.d1.database.query(`${process.env.CLOUDFLARE_DATABASE}`,{
            account_id: `${process.env.CLOUDFLARE_ACCOUNTID}`,
            sql: sql,
            params: params
        }).then(res => res.result[0].results).catch(err => {throw new Error(err)})

        return result as T;

    } catch (error) {
        const erro = error as Error
        const message = erro.message;

        console.log(message);

        if(message.includes("You do not have permission to perform this operation.")){
            return null
        }

        return null;
    }
}