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
import { useAuth } from "../contexts/Contexts"
import { useEffect } from "react"

// zod validator
const signupSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }).max(20, {
    message: "Username has a 20 character limit."
  }).regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only contain alphanumeric characters."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  }). max(20, {
    message: "Password has a 20 character limit."
  }).regex(/^[a-zA-Z0-9]+$/, {
    message: "Password can only contain alphanumeric characters."
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
}).superRefine(async (data, ctx) => {
  const res = await fetch("http://localhost:3000/api/validate/signup", {
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
    const result = await signup(data);
    
    if(result.loggedIn) {
      navigate("/");
    } else {
      console.error("Signup failed");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
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
                        <Input id="username" type="text" required {...field} />
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
                        <Input id="password" type="password" placeholder="●●●●●●●●" required {...field} />
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
                        <Input id="confirmPassword" type="password" placeholder="●●●●●●●●" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => googleLogin()}>
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
