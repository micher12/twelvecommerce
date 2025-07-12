"use client";

import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import Image from "next/image";

export  function Header(){

    return (
        <header className="fixed top-5 left-0 w-full z-10">
            <div className="container">
                <nav className="border rounded-xl p-2 px-5 w-full flex items-center bg-zinc-700/60  shadow-xl dark:shadow-slate-200/10 backdrop-blur-xs">
                    <Link href={"/"}><Image priority className="hover:opacity-40" src={"/images/white_logo.png"} width={80} height={80} alt="Logo" /></Link>
                    <ul className="w-full flex items-center justify-end">
                        <div className="w-full max-w-lg mx-auto">
                            <Input className="h-7" 
                                placeholder="Pesquisar..."
                            />
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold ">
                            <Link className="hover:text-zinc-400" href={"/home"}>Home</Link>
                            <Link className="hover:text-zinc-400" href={"/sobre"}>Sobre</Link>
                            <Link className="hover:text-zinc-400" href={"/products"}>Produtos</Link>
                            <Link className="hover:text-zinc-400" href={"/profile"} ><span className="sr-only">Usuário</span><User className="w-5 h-5" /></Link>
                            <Link className="hover:text-zinc-400" href={"/cart"} ><span className="sr-only">Carrinho</span><ShoppingCart className="w-5 h-5" /></Link>
                        </div>
                        
                    </ul>
                </nav>
            </div>
        </header>
    )
}