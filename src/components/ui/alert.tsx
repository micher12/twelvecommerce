import { CircleAlert, CircleCheckIcon, TriangleAlert } from "lucide-react"

export function Alert({type, message, className}: {type: "sucesso" | "erro" | "warning" | null, message: string, className?: string}){

    if(!type) return null;

    if(type === "sucesso"){
        return(
            <div className={`fixed z-20 top-25 right-4 sm:right-8 border-eborder rounded-md border border-emerald-500/50 px-4 py-3 backdrop-blur-sm fadeIn ${className}`}>
                <p className="text-sm">
                    <CircleCheckIcon
                    className="me-3 -mt-0.5 inline-flex text-emerald-500"
                    size={16}
                    aria-hidden="true"
                    />
                    {message}
                </p>
            </div>
        )
    }

    if(type === "erro"){
        return(
            <div className={`fixed z-20 top-25 right-4 sm:right-8 rounded-md border border-red-500/50 px-4 py-3 backdrop-blur-sm fadeIn ${className}`}>
                <p className="text-sm">
                    <CircleAlert
                    className="me-3 -mt-0.5 inline-flex text-red-500"
                    size={16}
                    aria-hidden="true"
                    />
                    {message}
                </p>
            </div>
        )
    }

    if(type === "warning"){
        return(
            <div className={`fixed z-20 top-25 right-4 sm:right-8 rounded-md border border-amber-500/50 px-4 py-3 backdrop-blur-sm fadeIn ${className}`}>
                <p className="text-sm">
                    <TriangleAlert
                    className="me-3 -mt-0.5 inline-flex text-amber-500"
                    size={16}
                    aria-hidden="true"
                    />
                    {message}
                </p>
            </div>
        )
    }

}