import { RegisterForm } from "@/components/register/register-form";

export default function Register(){
    return(
        <div className="min-h-screen py-25! container">
            <div className="w-full flex justify-center">
                <RegisterForm />
            </div>
        </div>
    )
}