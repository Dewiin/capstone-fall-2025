import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/contexts/Contexts"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useState, useEffect } from "react"

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

// Username and passphrase parameters
const USER_LEN_MINIMUM = 6
const USER_LEN_MAXIMUM = 20
const PASS_LEN_MINIMUM = 10
const PASS_LEN_MAXIMUM = 512
const PRINTABLE_UNICODE = /^[\P{Cc}\P{Cn}\P{Cs}]+$/gu // allow only, printable (unicode) characters; https://stackoverflow.com/a/12054775
const PRINTABLE_MESSAGE = "can only contain printable characters."

// zod validator
const signupSchema = z.object({
  username: z.string().min(USER_LEN_MINIMUM, {
    message: "Username must be at least " + USER_LEN_MINIMUM + " characters.",
  }).max(USER_LEN_MAXIMUM, {
    message: "Username has a " + USER_LEN_MAXIMUM + " character limit."
  }).regex(PRINTABLE_UNICODE, { 
    message: "Username " + PRINTABLE_MESSAGE
  }),
  password: z.string().min(PASS_LEN_MINIMUM, {
    message: "Password must be at least " + PASS_LEN_MINIMUM + " characters."
  }). max(PASS_LEN_MAXIMUM, {
    message: "Password has a " + PASS_LEN_MAXIMUM + " character limit."
  }).regex(PRINTABLE_UNICODE, { 
    message: "Password " + PRINTABLE_MESSAGE
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
}).superRefine(async (data, ctx) => {
  const res = await fetch(`${API_URL_DOMAIN}/api/validate/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: data.username }),
  });

  const { exists } = await res.json();
  if(exists) {
    ctx.addIssue({
      message: "Username already exists.",
      path: ["username"],
    })
  }
});

// component
export function SignupForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const { user, signup, googleLogin } = useAuth();

  useEffect(() => {
    if(user) {
      navigate("/");
    }
  }, [user, navigate]);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange",
  })

  async function onSubmit(data) {
    setLoading(true);
    const result = await signup(data);
    
    if(result.loggedIn) {
      setLoading(false);
      navigate("/");
    } else {
      setLoading(false);
      console.error("Signup failed");
    }
  }

  async function onGoogleSubmit() {
    setLoading(true);
    googleLogin();
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative border-1 dark:bg-slate-950 bg-indigo-200 dark:border-indigo-200 border-indigo-900">
        { loading && <LoadingOverlay /> }
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter a username and password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField 
                  className="grid gap-3"
                  control={form.control}
                  name="username"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel> Username </FormLabel>
                      <FormControl>
                        <Input 
                          className="dark:border-indigo-200 border-indigo-900 bg-[rgba(255,255,255,0.5)]" 
                          id="username" 
                          type="text" 
                          autoComplete="off"
                          required 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  className="grid gap-3"
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel> Password </FormLabel>
                      <FormControl>
                        <Input 
                          className="dark:border-indigo-200 border-indigo-900 bg-[rgba(255,255,255,0.5)]" 
                          id="password" 
                          type="password" 
                          autoComplete="off"
                          placeholder="●●●●●●●●●●" 
                          required 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  className="grid gap-3"
                  control={form.control}
                  name="confirmPassword"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel> Confirm Password </FormLabel>
                      <FormControl>
                        <Input 
                          className="dark:border-indigo-200 border-indigo-900 bg-[rgba(255,255,255,0.5)]" 
                          id="confirmPassword" 
                          type="password" 
                          autoComplete="off"
                          placeholder="●●●●●●●●●●" 
                          required 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                  <Button variant="outline" className="w-full" onClick={(e) => {
                    e.preventDefault();
                    onGoogleSubmit();
                  }}>
                    Sign In With Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/form/login" className="underline underline-offset-4">
                  Log In
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
