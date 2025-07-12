import Cloudflare from "cloudflare";

export async function connectionAdmin<T>(sql: string, params: string[] | undefined = undefined){

    const client = new Cloudflare({
        apiToken: process.env.CLOUDFLARE_ADMIN_TOKEN
    });

    const result = await client.d1.database.query(`${process.env.CLOUDFLARE_DATABASE}`,{
        account_id: `${process.env.CLOUDFLARE_ACCOUNTID}`,
        sql: sql,
        params: params
    }).then(res => res.result[0].results) as T;

    return result;
}