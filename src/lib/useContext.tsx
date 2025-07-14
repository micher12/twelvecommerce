"use client";

import { Alert } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import QueryProvider from "./QueryClientProvider";

const ThisContext = createContext<UseContextProps | null>(null);

export function ContextProvider({children}: {children: ReactNode}){

    const [alertType, setAlertType] = useState<"sucesso" | "erro" | "warning" | null>(null);
    const [alertMessage, setAlertMessage] = useState<string>("");
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

    return (    
        <ThisContext 
        value={{
            setAlert,
            setLoader,
        }}>
            <QueryProvider>
                {children}
            </QueryProvider>
            <Alert type={alertType} message={alertMessage} />
            <Loader type={loader} />
        </ThisContext>
    )
}

export function useGetContext(){
    return useContext(ThisContext);
}