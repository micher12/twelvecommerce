"use client";

import { UseAuthContextProps } from "@/interfaces/use-auth-context-interface";
import { createContext, ReactNode, useContext } from "react";


const AuthContext = createContext<UseAuthContextProps | null>(null);

export function AuthContextProvider({children}: {children: ReactNode}){

    return(
        <AuthContext value={{
            
        }}>
            {children}
        </AuthContext>
    )

}

export function getAuthContext(){
    return useContext(AuthContext);
}