"use server";

import nodemailer from "nodemailer"

export async function sendmail(email: string, title: string = "Código de verificação ✅", content?: string){

    function stripTags(input: string): string {
        return input.replace(/<\/?[^>]+(>|$)/g, "");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: `${process.env.EMAIL_TRANSPORTER}`,
            pass: `${process.env.PASSWORD_TRANSPORTER}`,
        }
    })

    const verificationCode = Math.floor(100_000 + Math.random() * 900_000).toString();

    let html: string = "";

    html = `
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
                    background-color: #222; /* oklch não é suportado por todos os clientes de email */
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
                    font-size: 2rem;
                    letter-spacing: 0.5rem;
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
                <p class="center">Seu código de verificação:</p>
                <p class="center">Não compartilhe com ninguém caso você não tenha socilitado.</p>
                <div class="center">
                    <span class="code">${verificationCode}</span>
                </div>
            </div>
        </body>
        </html>
    `;

    if(content)
        html = content

    await transporter.sendMail({
        from: `"Twelve Commerce " <${process.env.EMAIL_TRANSPORTER}>`,
        to: email,
        subject: title,
        text: stripTags(html), // plain‑text body
        html: html, // HTML body
    });


    return verificationCode;

}