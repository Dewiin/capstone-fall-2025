import { useParams } from "react-router-dom";
import { LoginForm } from "./LoginForm"; 
import { SignupForm } from "./SignupForm";
import { Footer } from "@/components/Footer";

export function Form() {
    const { method } = useParams();

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 w-full mt-24 justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    { (method === "login") ? (
                        <div className="flex flex-col gap-6">
                            <p className="font-bold text-2xl text-center">Brainstorm</p>
                            <LoginForm />
                        </div>
                    ) : method === "signup" ? (
                        <div className="flex flex-col gap-6">
                            <p className="font-bold text-2xl text-center">Brainstorm</p>
                            <SignupForm />
                        </div>
                    ) : null }
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
} 