"use client";

import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export function HamburguerBtn({value, onClick}: {value: boolean, onClick: Dispatch<SetStateAction<boolean>>}){

  
    return(
        <>
        <div onClick={()=>onClick(!value)} className="relative w-[28px] h-[25px] top-1 cursor-pointer myTransition " >
            <div className={`absolute left-0 w-full bg-white h-[2px] rounded-full myTransition
                ${value 
                    ? "top-[8px] rotate-[45deg] h-[3px]" 
                    : "top-[0]"}`} 
            />
            <div className={`absolute left-0 bg-white h-[2px] rounded-full myTransition
                ${value 
                    ? "top-[8px] w-0" 
                    : "top-[8px] w-full"}`} 
            />
            <div className={`absolute left-0  w-full bg-white h-[2px] rounded-full myTransition
                ${value 
                    ? "top-[8px] rotate-[-45deg] h-[3px]" 
                    : "top-[16px]"}`} 
            />
        </div>

        {value &&
            <div className="fixed top-14 border w-full! bg-zinc-800/60 backdrop-blur-xl p-6! rounded-lg left-0 container fadeInPop flex flex-col gap-2 items-center">
                <Link onClick={()=>onClick(!value)} className="hover:text-zinc-400" href={"/home"}>Home</Link>
                <Link onClick={()=>onClick(!value)} className="hover:text-zinc-400" href={"/about"}>Sobre</Link>
                <Link onClick={()=>onClick(!value)} className="hover:text-zinc-400" href={"/products"}>Produtos</Link>
                <Link onClick={()=>onClick(!value)} className="hover:text-zinc-400 flex gap-1" href={"/profile"} ><User className="w-5 h-5" /> Usuário</Link>
                <Link onClick={()=>onClick(!value)} className="hover:text-zinc-400 flex gap-1" href={"/cart"} ><ShoppingCart className="w-5 h-5" /> Carrinho</Link>
            </div>
        }
        </>
    )
}