"use server";

import admin from "@/lib/AdminAuth";
import { sendmail } from "./sendmail";

export async function recoverPassword(email: string){

    try {
        const link = await admin.auth().generatePasswordResetLink(email);

        const content = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    .container{
                        margin: 0 auto;
                        max-width: 600px;
                        width: 100%;
                        border: 1px solid #f2f2f23d;
                        background-color: #222;
                        color: #fff;
                        padding: 1.25rem;
                        border-radius: .5rem;
                    }
                    .center{
                        text-align: center;
                    }
                    h2,p{
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    .code {
                        font-size: 12px;
                        letter-spacing: 0.1rem;
                        font-weight: bold;
                        background: #000;
                        padding: 0.5rem 1rem;
                        border-radius: 0.25rem;
                        display: inline-block;
                        margin: 1rem 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="center">
                        <img width="250" src="https://twelvecommerce.vercel.app/images/white_logo.png" alt="Twelve Commerce Logo" />
                    </div>
                    <h2 class="center">
                        TWELVE COMMERCE 
                        <img alt="Verificado" width="20" style="vertical-align: middle; margin-left: 0.5rem;" src="https://static.vecteezy.com/system/resources/thumbnails/047/309/934/small_2x/verified-badge-profile-icon-png.png" />
                    </h2>
                    <p class="center">Seu link para redefinir sua senha:</p>
                     <p class="center">Não compartilhe com ninguém caso você não tenha socilitado.</p>
                    <div class="center">
                        <span class="code">${link}</span>
                    </div>
                </div>
            </body>
            </html>
        `

        await sendmail(email,"Redefinir senha 🔑", content);

        return "ok";

    } catch (error) {

        const erro = error as Error;
        const message = erro.message

        console.log(error);

        if(message.includes("RESET_PASSWORD_EXCEED_LIMIT"))
            return "Limite excedido";

        return "Algo deu errado";
    }
}