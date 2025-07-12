"use client";

import { Checkbox } from "./ui/checkbox";
import { LogIn } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { GoogleIcon } from "./ui/googleIcon";
import { Input } from "./ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

export function LoginForm(){

    const formSchema = z.object({
        email: z.string().min(10, {
            message: "Mínimo de 10 caracteres."
        }),
        password: z.string()
        .min(6, {message: "Mínimo de 6 caracteres."})
        .refine(pass=> /[0-9]/.test(pass), {message: "A senha deve conter pelo menos um número"})
        .refine(pass => /[!@#$%&*]/.test(pass), {message: "A senha deve conter pelo menos um caractere especial válido: (!@#$%&*)."}),
        remember: z.boolean().optional(),
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

    async function onSubmit({email, password, remember}: formProps){
        console.log(email,password,remember)
    }

    return(
        <Card className="basis-1/2 mt-10">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between gap-3">Entrar <LogIn className="w-6 h-6"/></CardTitle>
                <CardDescription>
                    Entre na sua conta para acessar todas as suas compras.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="cursor-pointer border py-1 px-4 flex items-center gap-1 w-fit rounded-full text-sm font-semibold hover:text-white hover:bg-zinc-500/50 transition mb-4" ><GoogleIcon className="w-4 h-4" /> Google</div>

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
                                    <Input type="password" placeholder="Sua senha..." {...field} />
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
                            <div className="text-xs hover:underline cursor-pointer text-zinc-400 hover:text-white transition font-semibold">Esqueceu a senha?</div>
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
