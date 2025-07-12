"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn } from "lucide-react";
import { GoogleIcon } from "@/components/ui/googleIcon";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { LoginForm } from "@/components/loginForm";

export default function Login(){

    

    return (
        <div className="min-h-screen py-25! container">
            <div className="flex w-full justify-center">
                <LoginForm />
            </div>
        </div>
    )
}