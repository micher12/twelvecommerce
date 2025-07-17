"use server";

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import CryptoJS, { AES } from "crypto-js";

const requestStore: Record<string, {count: number, date: number}> = {};

export default async function verifyCode(req: NextApiRequest, res: NextApiResponse){

    if(req.method !== "POST")
        return res.status(405).json({erro: "Método inválido!"})

    if(!req.headers.authorization)
        return res.status(401).json({erro: "Acesso negado!"});

    const token = req.headers.authorization.split("Bearer ")[1];

    if(!token) return res.status(401).json({erro: "Acesso negado!"});

    if(!req.body.value || !req.body)
        return res.status(400).json({erro: "Dados inválidos!"})

    const value = req.body.value;

    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'anonymous';


    // Control anti-brute force.
    function verificarAcesso(ip: string): boolean {
        const agora = Date.now();
        const ultimoAcesso = requestStore[ip];

        if(ultimoAcesso && (agora - ultimoAcesso.date > 60 * 1000)){
            requestStore[ip] = {count: 1, date: agora};
        }

        if (ultimoAcesso && ultimoAcesso.count > 10) {
            return false; 
        }

        if(ultimoAcesso){
            requestStore[ip] = {count: requestStore[ip].count + 1, date: requestStore[ip].date};
        }else{
            requestStore[ip] = {count: 1, date: agora};
        }

        return true; 
    }

    if(!verificarAcesso(ip))
        return res.status(429).json({ erro: "Tente novamente em 1 minuto." });

    try {
        const decodedSession =  jwt.verify(token, process.env.JWT_TOKEN as string) as jwt.JwtPayload;

        if(decodedSession.purpose !== "code_verify")
            return res.status(401).json({erro: "Acesso negado!"});

        const decodedCode = AES.decrypt(decodedSession.password, process.env.PASSWORD_HASH as string).toString(CryptoJS.enc.Utf8);

        if(decodedCode === value)
            return res.status(200).json({sucesso: "Código verificado!"});

        return res.status(400).json({erro: "Código inválido!"})

    } catch (error) {
        const erro = error as Error;
        const message = erro.message;

        if(message.includes("jwt expired"))
            return res.status(401).json({erro: "Código expirado!"})

        return res.status(400).json({erro: "Algo deu errado."})
    }
}

setInterval(() => {
    const now = Date.now();
    for (const ip in requestStore) {
        if (now - requestStore[ip].date > 5 * 60 * 1000) {
            delete requestStore[ip]; 
        }
    }
}, 10 * 60 * 1000); // 10 min