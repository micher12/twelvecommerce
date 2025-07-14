import { Dispatch, SetStateAction } from "react"

export interface UseContextProps{
    setAlert: (type: "sucesso" | "erro" | "warning" | null, message: string) => void;
    setLoader:  Dispatch<SetStateAction<boolean>>;
}