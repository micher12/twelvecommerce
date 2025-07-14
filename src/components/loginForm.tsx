"use client";

import { Checkbox } from "./ui/checkbox";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { GoogleIcon } from "./ui/googleIcon";
import { Input } from "./ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AuthUserLogin } from "@/models/user-login";
import { useGetContext } from "@/lib/useContext";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseConfig } from "@/lib/use-firebase-config";
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AuthGoogleLogin } from "@/models/user-google-login";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export function LoginForm(){

    const { setAlert, setLoader } = useGetContext() as UseContextProps;
    const router = useRouter();

    const formSchema = z.object({
        email: z.string().trim().min(10, {
            message: "Mínimo de 10 caracteres."
        }),
        password: z.string()
        .trim()
        .min(6, {message: "Mínimo de 6 caracteres."})
        .refine(pass=> /[0-9]/.test(pass), {message: "A senha deve conter pelo menos um número"})
        .refine(pass => /[!@#$%&*]/.test(pass), {message: "A senha deve conter pelo menos um caractere especial válido: (!@#$%&*)."}),
        remember: z.boolean(),
    })

    type formProps = z.infer<typeof formSchema>

    const form = useForm<formProps>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: true,
        }
    })

    const [typePassword, changeTypePassword] = useState<"text" | "password">("password");

    async function onSubmit({email, password, remember}: formProps){
        try {
            setLoader(true);

            const res = await AuthUserLogin(email, password, remember);

            if(res !== "ok")
            return setAlert("erro", res);

            setAlert("sucesso", "Logado com sucesso")
            router.push("/profile");
            return;

        } finally {
            setLoader(false);
        }
    }

    async function loginWithGoogle(){
        try {
            const { firebaseConfig } = await getFirebaseConfig();

            let app: FirebaseApp;

            try {
                app = getApp();
            } catch {
                app = initializeApp(firebaseConfig);
            }

            const auth = getAuth(app);

            const googleProvider = new GoogleAuthProvider();

            const token = await signInWithPopup(auth, googleProvider).then(res => res.user.getIdToken());

            setLoader(true);
            const res = await AuthGoogleLogin(token);

            if(res !== "ok")
                return setAlert("erro", res);

            setAlert("sucesso", "Logado com sucesso!");

            router.push("/profile");
            return;

        } finally {
            setLoader(false);
        }
    }

    async function submitRecoverPassword(){
        const form = document.getElementById("recoverPass");

        if(!form) return;

        const data = new FormData(form as HTMLFormElement);

        const email = data.get("email");

        // to continue
        console.log(email);
    }

    return(
        <Card className="basis-1/1 xs:basis-4/5 lg:basis-1/2 mt-10">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between gap-3">Entrar <LogIn className="w-6 h-6"/></CardTitle>
                <CardDescription>
                    Entre na sua conta para acessar todas as suas compras.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div onClick={loginWithGoogle} className="cursor-pointer border py-1 px-4 flex items-center gap-1 w-fit rounded-full text-sm font-semibold hover:text-white hover:bg-zinc-500/50 transition mb-4" ><GoogleIcon className="w-4 h-4" /> Google</div>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="meu_email@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <div className="flex items-center justify-between gap-3">
                                        <Input type={typePassword} placeholder="Sua senha..."  {...field} />
                                        <div onClick={()=> changeTypePassword(prev=> prev === "password" ? "text" : "password")} className="p-2 bg-zinc-700/50 rounded-lg cursor-pointer hover:bg-zinc-700" >
                                            {typePassword === "text" ? <Eye className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">

                                <FormField
                                    control={form.control}
                                    name="remember"
                                    render={({ field }) => {
                                    return(
                                        <FormItem>
                                        <FormControl>
                                            <Checkbox id="rember" checked={field.value} onCheckedChange={field.onChange}  />
                                        </FormControl>
                                        </FormItem>
                                    )}}
                                />
                
                                <label htmlFor="rember" className="text-sm">Lembrar de mim</label>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger >
                                    <div className="text-xs hover:underline cursor-pointer text-zinc-400 hover:text-white transition font-semibold">Esqueceu a senha?</div>
                                </AlertDialogTrigger>
                                <AlertDialogContent >
              
                                    <form id="recoverPass" >
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Esqueceu a senha ?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Insira seu e-mail para recuperar a senha.
                                            </AlertDialogDescription>
                                            <div className="my-2">
                                                <Input name="email" placeholder="meu_email@gmail.com" className="text-white" />
                                            </div>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-2">
                                            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={submitRecoverPassword} >Recuperar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </form>
                    
                                </AlertDialogContent>
                                <AlertDialogOverlay className="backdrop-blur-xs" />
                          
                            </AlertDialog>
                        </div>
                        <Button type="submit" className="cursor-pointer">Entrar</Button>
                        
                        <div className="w-full h-0.5 bg-zinc-400/20 rounded-full" />
                        <div className="text-center text-sm">
                            <p>Não possuí uma conta? <Link href={"/register"} className="text-blue-500 hover:underline">registrar-se</Link></p>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    )
}
