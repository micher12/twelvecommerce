import { isServer, QueryClient } from "@tanstack/react-query";


function makeQueryClient(){
    return new QueryClient({
        defaultOptions: {
            queries:{
                staleTime: Infinity,
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                gcTime: 1000 * 60 * 5, // 5 minutos
            }
        }
    })

}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(){

    if(isServer){
        return makeQueryClient();
    }else{
        if(!browserQueryClient) browserQueryClient = makeQueryClient();
        
        return browserQueryClient
    }

}