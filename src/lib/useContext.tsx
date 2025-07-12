"use client";

import { UseContextProps } from "@/interfaces/use-context-interface";
import { createContext, ReactNode, useContext } from "react";

const ThisContext = createContext<UseContextProps | null>(null);

export function ContextProvider({children}: {children: ReactNode}){

    return (    
        <ThisContext 
        value={{
            name: "apenas um teste"
        }}>
            {children}
        </ThisContext>
    )
}

export function getContext(){
    return useContext(ThisContext);
}


