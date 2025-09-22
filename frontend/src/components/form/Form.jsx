import { useParams } from "react-router-dom";
import { LoginForm } from "./LoginForm"; 
import { SignupForm } from "./SignupForm";
import { Navbar01 } from "@/components/ui/shadcn-io/navbar-01";

export function Form() {
    const { method } = useParams();

    return (
        <>
            <div className="flex min-h-[90vh] w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    { (method === "login") ? (
                        <LoginForm />
                    ) : method === "signup" ? (
                        <SignupForm />
                    ) : null }
                </div>
            </div>
        </>
    );
} 