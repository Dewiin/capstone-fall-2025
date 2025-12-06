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
import { LoadingOverlay } from "../LoadingOverlay";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/Contexts"
import { useState, useEffect } from "react"

// zod validator
const loginSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters."
  }).max(20, {
    message: "Username has a 20 character limit."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  }).max(20, {
    message: "Password has a 20 character limit."
  })
})

// component
export function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const { user, login, googleLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
    mode: "onChange",
  });

  async function onSubmit(data) {
    setLoading(true);
    const result = await login(data);
    
    if(result.loggedIn) {
      setLoading(false);
      navigate("/");
    } else {
      setLoading(false);
      console.error(`Login failed`);
      form.setError("username", {
        type: "server",
        message: "Username or password is incorrect.",
      });
      form.setError("password", {
        type: "server",
        message: "Username or password is incorrect.",
      });
    }
  }

  function onGoogleSubmit() {
    setLoading(true);
    googleLogin();
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card 
        className="relative border-1 dark:bg-slate-950 bg-indigo-200 dark:border-indigo-200 border-indigo-900"
      >
        { loading && <LoadingOverlay /> }
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
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
                          required {...field} />
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
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button variant="outline" className="w-full" onClick={(e) => {
                    e.preventDefault();
                    onGoogleSubmit();
                  }}>
                    Sign In with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <a href="/form/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
