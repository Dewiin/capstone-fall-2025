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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// zod validator
const generateSchema = z.object({
    textInput: z.string().min(300, {
        message: "Text must be at least 300 characters."
    }).max(30000, {
        message: "Text must be less than 30,000 characters."
    }).optional()
});

export function GeneratePage() {    
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ uploadType, setUploadType ] = useState();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const form = useForm({
        resolver: zodResolver(generateSchema),
        mode: "onChange",
    })


    return (
        <div className="flex min-h-[90vh] w-full items-center justify-center p-6 md:p-10">
            <Tabs defaultValue="text">
                <TabsList>
                    <TabsTrigger value="text">Text Upload</TabsTrigger>
                    <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text">

                </TabsContent>
                <TabsContent value="pdf">

                </TabsContent>
            </Tabs>
        </div>
    )
}