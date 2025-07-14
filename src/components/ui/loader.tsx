import { LoaderCircle } from "lucide-react";

export function Loader({type}:{type: boolean}){

    if(!type) return null;

    return(
        <div className="top-0 left-0 fixed z-[15] w-full h-screen bg-black/50 backdrop-blur-xs flex items-center justify-center">
            <div className="relative z-[18] animate-spin">
                <LoaderCircle className="w-8 h-8" />
            </div>
        </div>
    )
}