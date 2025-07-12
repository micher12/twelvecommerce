import { Header } from "@/components/header";
import { ContextProvider } from "@/lib/useContext";

export default function HomeLayout({children,}: {children: React.ReactNode;}) {
    return (
        <>
            <Header />
            <ContextProvider>
                {children}
            </ContextProvider>
        </>
    );
}
