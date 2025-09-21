import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "./LoginForm"; 
import { SignupForm } from "./SignupForm";
import { Navbar01 } from "./ui/shadcn-io/navbar-01";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export function Form() {
    const [count, setCount] = useState(0);
    const { method } = useParams();

    return (
        <>
            <div className="relative w-full">
                <Navbar01 />
            </div>
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