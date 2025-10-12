import { useParams } from "react-router-dom";
import { LoginForm } from "./LoginForm"; 
import { SignupForm } from "./SignupForm";
import { Footer } from "@/components/Footer";

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
            
            {/* Footer */}
            <Footer />
        </>
    );
} 