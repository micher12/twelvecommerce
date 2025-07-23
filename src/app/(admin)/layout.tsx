import { AuthContextProvider } from "@/lib/useAuthContext";
import { Metadata } from "next";
import { AdminProvider } from "./admin-provider";
import { ReactNode } from "react";
import { getQueryClient } from "@/lib/getQueryClient";
import { getLevelUser } from "@/api/get-level-user";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
    title: "ADMIN | TwelveCommerce"
}

export default async function AdminLayout({ children }: {children: ReactNode}){

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["level-user"],
        queryFn: getLevelUser,
    });

    return (
        <AuthContextProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminProvider>
                    {children}
                </AdminProvider>
            </HydrationBoundary>
        </AuthContextProvider>
    )
}