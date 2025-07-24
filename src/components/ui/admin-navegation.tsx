"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";
import { usePathname } from "next/navigation";
import { Blocks, FolderPlus, Home, ListTree, Package, PackagePlus, Settings2 } from "lucide-react";
import { JSX } from "react";
import React from "react";

const routers = new Map<string, {path: string; label: string; icon: JSX.Element | null }>([
    
    ["admin", { path: "/admin", label: "Admin", icon: <Home /> }],
    ["products", { path: "/admin/products", label: "Produtos", icon: <Package /> }],
    ["new", { path: "/admin/products/new", label: "Novo produto", icon: <PackagePlus /> }],
    ["category", { path: "/admin/category", label: "Categorias", icon: <Blocks /> }],
    ["new_category", { path: "/admin/category/new_category", label: "Nova categoria", icon: <FolderPlus /> }],
    ["edit_category", { path: "/admin/category/edit_category", label: "Editar categoria", icon: <Settings2 /> }],
    ["sub_category", { path: "/admin/category/sub_category", label: "Sub Categorias", icon: <ListTree /> }],
    ["new_subcategory", { path: "/admin/category/sub_category/new_subcategory", label: "Nova Sub Categoria", icon: <FolderPlus /> }],
    ["edit_subcategory", { path: "/admin/category/sub_category/edit_subcategory", label: "Editar Sub Categoria", icon: <Settings2 /> }],

]);

export function AdminNavegation(){

    const path = usePathname();

    return(
        <Breadcrumb>
            <BreadcrumbList>
                {path?.split("/").map((pathname, index)=>{
                    if(index === 0) return;
                    return(
                        <React.Fragment key={pathname}>
                        {path.split("/").length - 1 > index 
                        ?
                            <>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`${routers.get(pathname)?.path}`} className="[&>svg]:w-4 text-xs flex items-center gap-1" >{routers.get(pathname)?.icon}{routers.get(pathname)?.label}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            </>
                        :   
                            <BreadcrumbItem key={pathname}>
                                <BreadcrumbPage className="[&>svg]:w-4 text-xs flex items-center gap-1 font-semibold">{routers.get(pathname)?.icon}{routers.get(pathname)?.label}</BreadcrumbPage>
                            </BreadcrumbItem>
                        }
                        </React.Fragment>
                        
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}