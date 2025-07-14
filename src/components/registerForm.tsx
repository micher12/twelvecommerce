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
import { InputMask } from 'primereact/inputmask';
import { useGetContext } from "@/lib/useContext";
import { UseContextProps } from "@/interfaces/use-context-interface";
import { AuthUserRegister } from "@/models/user-register";
import { useState } from "react";
import { verifyEmail } from "@/models/verify-email";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseConfig } from "@/lib/use-firebase-config";
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { AuthGoogleLogin } from "@/models/user-google-login";

export function RegisterForm(){

    const { setAlert, setLoader } = useGetContext() as UseContextProps;

    const router = useRouter();

    const formSchema = z.object({
        name: z.string().trim().min(5, {message: "Mínimo de 5 caracteres"}),
        email: z.string().trim().min(10, {
            message: "Mínimo de 10 caracteres."
        }),
        phone: z.string().refine(val => !val.includes("_"), {message: "Número incompleto"}),
        password: z.string()
            .min(6, {message: "Mínimo de 6 caracteres."})
            .refine(pass=> /[0-9]/.test(pass), {message: "A senha deve conter pelo menos um número"})
            .refine(pass => /[!@#$%&*]/.test(pass), {message: "A senha deve conter pelo menos um caractere especial válido: (!@#$%&*)."}),
        remember: z.boolean(),
        politics: z.boolean().refine(val => val === true, {message: "É preciso concordar com os termos de uso!"}),
    })

    type formProps = z.infer<typeof formSchema>

    const [codeVisible, setCodeVisible] = useState<string | null>(null);
    const [data, setData] = useState<formProps | null>(null);
    const [typePassword, setTypePassword] = useState<"password" | "text">("password");

    const form = useForm<formProps>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            remember: true,
            politics: false,
        }
    })

    async function verifyCode(value: string){
        try {
            if(value.length < 6) return;

            const code = await fetch("/api/verify-code",{
                method: "POST",
                body: JSON.stringify({value}),
                headers:{
                    "Content-type":"application/json",
                    Authorization: `Bearer ${codeVisible}`
                }
            }).then(res => res.json());

            if(!code.sucesso)
                return setAlert("erro", code.erro);

            setLoader(true);
            const res = await AuthUserRegister(data as formProps);
            
            if(res !== "ok")
                return setAlert("erro", res);

            setAlert("sucesso", "Usuário cadastrado com sucesso!");
            router.push("/profile");
            return 
            
        } finally {
            setLoader(false);
        }
        
    }

    async function onSubmit({ name, email, phone, password, remember, politics }: formProps){
        try {
            setLoader(true);
            if(!politics) return setAlert("erro", "É preciso aceitar as políticas para criar uma conta");

            const code = await verifyEmail(email);

            if(!code) return setAlert("erro", "Conta já cadastrada!")

            setAlert("sucesso", "Código enviado para seu e-mail!");

            setCodeVisible(code);

            setData({
                email,
                name,
                password,
                phone,
                politics,
                remember
            })

            return;
        } finally {
            setLoader(false);
        }
    }

    async function googleLogin(){
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

    return(
        <Card className="basis-1/1 xs:basis-4/5 lg:basis-1/2 mt-10">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between gap-3">Registrar-se <LogIn className="w-6 h-6"/></CardTitle>
                <CardDescription>
                    Registre-se e comece comprar em poucos segundos.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {!codeVisible ? 
                <>
                <div onClick={googleLogin} className="cursor-pointer border py-1 px-4 flex items-center gap-1 w-fit rounded-full text-sm font-semibold hover:text-white hover:bg-zinc-500/50 transition mb-4" ><GoogleIcon className="w-4 h-4" /> Google</div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome completo</FormLabel>
                                <FormControl>
                                    <Input disabled={form.formState.isSubmitting}  placeholder="Seu nome..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={form.formState.isSubmitting} type="email" placeholder="meu_email@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <InputMask disabled={form.formState.isSubmitting} className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" mask="(99) 99999-9999" autoClear={false} placeholder="(00) 91111-2222" {...field} />
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
                                    <div className="flex flex-items-center justify-between gap-3">
                                        <Input disabled={form.formState.isSubmitting} type={typePassword} placeholder="Sua senha..." {...field} />
                                        <div onClick={()=> setTypePassword(prev=> prev === "password" ? "text" : "password")} className="p-2 bg-zinc-700/50 rounded-lg cursor-pointer hover:bg-zinc-700" >
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
                                            <Checkbox disabled={form.formState.isSubmitting} id="rember" checked={field.value} onCheckedChange={field.onChange}  />
                                        </FormControl>
                                        </FormItem>
                                    )}}
                                />
                
                                <label htmlFor="rember" className="text-sm">Lembrar de mim</label>
                            </div>
                            <div className="text-xs hover:underline cursor-pointer text-zinc-400 hover:text-white transition font-semibold">Esqueceu a senha ?</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="politics"
                                render={({ field }) => {
                                return(
                                    <FormItem>
                                    <FormControl >
                                        <div className="flex items-center gap-2">
                                            <Checkbox disabled={form.formState.isSubmitting} id="politics" checked={field.value} onCheckedChange={field.onChange}  />
                                            <label htmlFor="politics" className="text-sm">Li e aceito os <Link href={"/policy-terms"} className="underline font-bold ">termos</Link> de uso</label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}}
                            />
                        </div>

                        <Button disabled={form.formState.isSubmitting} type="submit" className="cursor-pointer">Registrar</Button>

                         <div className="w-full h-0.5 bg-zinc-400/20 rounded-full" />
                        <div className="text-center text-sm">
                            <p>Já possuí uma conta? <Link href={"/login"} className="text-blue-500 hover:underline">entrar</Link></p>
                        </div>
                    </form>
                </FormProvider>
                </>
                :
                <div className="w-full flex-col items-center flex justify-center">
                    <p className="text-sm text-zinc-200 mb-2">Digite o código de 6 digitos enviado para seu e-mail.</p>
                    <InputOTP maxLength={6} onChange={verifyCode} >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className="h-12 w-12" />
                            <InputOTPSlot index={1} className="h-12 w-12" />
                            <InputOTPSlot index={2} className="h-12 w-12" />
                            <InputOTPSlot index={3} className="h-12 w-12" />
                            <InputOTPSlot index={4} className="h-12 w-12" />
                            <InputOTPSlot index={5} className="h-12 w-12" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                }
            </CardContent>
        </Card>
    )
}
