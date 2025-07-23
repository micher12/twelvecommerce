"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLevelUser } from "@/api/get-level-user";
import { ArrowLeftFromLine, Blocks, ChevronDown, Funnel, FunnelPlus, Home, Package, PackagePlus, PackageSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNavegation } from "@/components/ui/admin-navegation";
import { usePathname } from "next/navigation";
import { Collapsible } from "@/components/ui/collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

const items = [
    {id: 1, level: 1, label: "Home", path: "/admin", icon: <Home />, hasSubItems: false},
    {id: 2, level: 3, label: "Produtos", path: "/admin/products", icon: <Package />, hasSubItems: true},
    {id: 3, level: 3, label: "Categorias", path: "/admin/category", icon: <Blocks />, hasSubItems: true},
]

const subItems = [
    {id: 1, itemId: 2, label: "Ver produtos", path: "/admin/products", icon: <PackageSearch />},
    {id: 2, itemId: 2, label: "Novo produto", path: "/admin/products/new", icon: <PackagePlus />},
    {id: 3, itemId: 3, label: "Listar categorias", path: "/admin/category", icon: <Funnel />},
    {id: 4, itemId: 3, label: "Nova categoria", path: "/admin/category/new_category", icon: <FunnelPlus />},
]

export function AdminProvider({children}:{children: ReactNode}){

    const path = usePathname();

    const { data: level } = useQuery({
        queryKey: ["level-user"],
        queryFn: getLevelUser,
        placeholderData: keepPreviousData,
    })

    return(
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild >
                                    <Link href={"/admin"} className="flex items-center justify-center text-xl font-bold gap-2 cursor-pointer hover:bg-zinc-900 active:bg-zinc-900" >
                                        <Image src={"/images/code_logo.png"} width={38} height={30} alt="Logo" priority />
                                        Dashboard
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="gap-2">

                    {level && items.map((item) => {
                        if(level > 0 && item.level <= level){
                            if(item.hasSubItems){
                                return (
                                <SidebarGroupContent key={item.id}>
                                <SidebarMenu>
                                    <Collapsible className="group/collapsible" >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton isActive={
                                                    subItems.some(thisItem => thisItem.itemId === item.id && thisItem.path === path )
                                                }>
                                                    {item.icon}
                                                    {item.label}
                                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {subItems.filter(subItem => subItem.itemId === item.id).map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.id}>
                                                            <SidebarMenuButton asChild >
                                                                <Link href={subItem.path} className="flex items-center gap-2">
                                                                    {subItem.icon}
                                                                    {subItem.label}
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                </SidebarMenu>
                                </SidebarGroupContent>
                                )
                            }

                            return (
                            <SidebarGroupContent key={item.id}>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={item.path === path}>
                                            <Link href={item.path} className="flex items-center gap-2">
                                                {item.icon}
                                                {item.label}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                            )
                        }
                            
                    })}
                         
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href={"/"} className="flex items-center justify-between gap-2 bg-zinc-500/50">
                                            Voltar
                                            <ArrowLeftFromLine />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarFooter>
            </Sidebar>
            <main className="container-xl py-3!">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>
                            <AdminNavegation />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                </Card>
            </main>
        </SidebarProvider>
    )
}