import { Dispatch, SetStateAction } from "react";

export interface UseAuthContextProps{
    setAlert: (type: "sucesso" | "erro" | "warning" | null, message: string) => void;
    setLoader:  Dispatch<SetStateAction<boolean>>;
}