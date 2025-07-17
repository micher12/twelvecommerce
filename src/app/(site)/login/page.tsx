import { LoginForm } from "@/components/login/login-form";

export default async function Login(){

    return (
        <div className="min-h-screen py-25! container">
            <div className="flex w-full justify-center">
                <LoginForm />
            </div>
        </div>
    )
}