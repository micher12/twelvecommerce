export interface UseContextProps{
    setAlert: (type: "sucesso" | "erro" | "warning" | null, message: string) => void
}