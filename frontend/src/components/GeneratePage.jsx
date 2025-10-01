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
import { 
    Dropzone, 
    DropzoneContent, 
    DropzoneEmptyState 
} from '@/components/ui/shadcn-io/dropzone';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
    const [ uploadType, setUploadType ] = useState("text");
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const form = useForm({
        resolver: zodResolver(generateSchema),
    })

    return (
        <div className="flex h-[70vh] w-full justify-center items-center mt-16">
            <Tabs 
                defaultValue={uploadType} 
                className="h-full md:w-xl w-sm"
                onValueChange={(val) => {
                    setUploadType(val);
                }}
            >
                <TabsList className="m-auto">
                    <TabsTrigger value="text" >Text Input</TabsTrigger>
                    <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <Card className="relative h-full">
                        { loading && <LoadingOverlay /> }
                        <CardHeader>
                            <CardTitle>
                                Text Input
                            </CardTitle>
                            <CardDescription>
                                Copy and paste your notes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-full">
                            <Form {...form} className="h-full">
                                <form onSubmit={form.handleSubmit()} 
                                    className="h-full flex flex-col gap-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="textInput"
                                        render={({ field }) => (
                                            <FormItem className="h-full">
                                                <FormControl>
                                                    <Textarea
                                                        className="resize-none flex-1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-fit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pdf">
                    <Card className="relative h-full">
                        { loading && <LoadingOverlay /> }
                        <CardHeader>
                            <CardTitle>
                                PDF Upload
                            </CardTitle>
                            <CardDescription>
                                Upload your notes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit()}>
                                    <Dropzone
                                        accept={{ 'application/*': ['.pdf'] }}
                                        maxFiles={1}
                                        maxSize={1024 * 1024 * 10}
                                        minSize={1024}
                                        onDrop={(e) => e.preventDefault()}
                                        onError={console.error}
                                    >
                                        <DropzoneEmptyState />
                                        <DropzoneContent />
                                    </Dropzone>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}