import { AuthContextProvider } from "@/lib/useAuthContext";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ADMIN | TwelveCommerce"
}


export default function AdminLayout({ children }: Readonly<{children: React.ReactNode;}>){
    return (
        <>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </>
    )

}