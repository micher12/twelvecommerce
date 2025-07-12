import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { ContextProvider } from "@/lib/useContext";
import { Header } from "@/components/header";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Twelve Commerce",
    description: "Twelve Commerce",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <body
                className={`${inter.variable} antialiased dark `}
            >
                <ContextProvider>
                    <Header />
                    {children}
                </ContextProvider>
            </body> 
        </html>
    );
}
