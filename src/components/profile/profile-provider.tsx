"use client";

import { LogOut, MapPinHouse, SidebarClose, SidebarOpen, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AuthUserLogOut } from "@/models/user-logout";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { useGetContext } from "@/lib/useContext";
import { usePathname, useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useUserInterface } from "@/interfaces/use-user-interface";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator } from "../ui/sidebar";
import Link from "next/link";
import { ReactNode, useState } from "react";

const menuItems = [
    {path: "/profile", text: "Home", icon: <User />, title: "Perfil"},
    {path: "/profile/address", text: "Endereços cadastrados", icon: <MapPinHouse />, title: "Endereços", description: "Cadastre e edite endereços."}
]

export function ProfileProvider({children}:{children: ReactNode}){

    const { setAlert } = useGetContext() as UseContextProps;
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const path = usePathname();

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: async ()=>{
            const res: {sucesso?: "ok", user?: useUserInterface, erro?: "Inváldio"} = await fetch("/api/profile").then(res => res.json());

            if(res.sucesso)
                return res.user

            return null;
        },
        placeholderData: keepPreviousData,
    })


    async function logOut(){
        const res = await AuthUserLogOut();
        if(res === "ok"){
            setAlert("sucesso", "Sessão finalizada!");
            router.push("/home");
        }
    }


    return (
        <>
        <SidebarProvider open={open} className="min-h-[78vh]">
            <Sidebar className="absolute py-25 h-auto z-1" collapsible="icon" variant="floating">
                <SidebarContent className="overflow-x-hidden!">
                    <SidebarGroup>
                        <SidebarGroupLabel>Perfil</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-2">
                                {menuItems.map((item)=>(
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild isActive={path === item.path} className={`${path === item.path && "bg-blue-600!"}`}>
                                            <Link href={item.path} className="flex items-center [&>svg]:size-4 [&>svg]:shrink-0 gap-2" > {item.icon} {item.text}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                        
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={logOut} variant={"outline"} className="cursor-pointer hover:bg-zinc-800">
                                <LogOut /> Sair
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
                
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="bg-zinc-500/50 rounded-md p-1.5 cursor-pointer " onClick={()=>setOpen(!open)}>
                        {open 
                        ? <SidebarClose />
                        : <SidebarOpen /> 
                        }    
                        </div> 
                        <h2 className="text-3xl font-bold">{menuItems.find(item=> item.path === path)?.title}</h2>
                    </CardTitle>
                    <CardDescription>
                        {user && path === "/profile" ? `Olá, seja bem vindo ${user?.name_user}!` 
                        : menuItems.find(item => item.path === path)?.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    
                    {children}
             
                </CardContent>
            </Card>
    
        </SidebarProvider>
        </>
    )
}