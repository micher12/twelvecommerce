"use client";

import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import QueryProvider from "./QueryClientProvider";


const AuthContext = createContext<UseAuthContextProps | null>(null);

export function AuthContextProvider({children}: {children: ReactNode}){

    const [alertType, setAlertType] = useState<"sucesso" | "erro" | "warning" | null>(null);
    const [alertMessage, setAlertMessage] = useState(""); 
    const [loader, setLoader] = useState(false);

    function setAlert(type: typeof alertType, message: string){
        setAlertType(type);
        setAlertMessage(message);
    }

    useEffect(()=>{
        if(!alertType) return;

        const timer = setTimeout(()=>{
            setAlert(null, "");
        },3800);

        return ()=>{
            clearTimeout(timer);
        }

    },[alertType]);

    const values: UseAuthContextProps = {
        setAlert,
        setLoader,
    };

    return(
        <AuthContext value={values}>
            <QueryProvider>
                {children}
            </QueryProvider>
            <Alert type={alertType} message={alertMessage} />
            <Loader type={loader} />
        </AuthContext>
    )

}

export function useGetAuthContext(){
    return useContext(AuthContext);
}