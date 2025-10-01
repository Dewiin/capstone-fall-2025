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
  FormMessage,
} from "@/components/ui/form"
import { 
    Dropzone, 
    DropzoneContent, 
    DropzoneEmptyState 
} from '@/components/ui/shadcn-io/dropzone';
import { Button } from "@/components/ui/button"
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
    }).optional(),

    fileInput: z.array(z.instanceof(File)).max(1, {
        message: "You can only upload one file."
    }).optional(),
});

export function GeneratePage() {    
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ uploadType, setUploadType ] = useState("text");
    const [ loading, setLoading ] = useState(false);
    const [ file, setFile ] = useState();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const form = useForm({
        resolver: zodResolver(generateSchema),
        mode: "onChange",
    });

    function handleDrop(files, onChange) {
        setLoading(true);

        if (files && files.length == 1) {
            setFile(files);
        }
        
        onChange(files);
        setLoading(false);
    }

    return (
        <div className="flex h-full w-full justify-center mt-12 mb-12">
            <Tabs 
                defaultValue={uploadType} 
                className="md:w-xl w-sm"
                onValueChange={(val) => {
                    setUploadType(val);
                }}
            >
                <TabsList className="m-auto">
                    <TabsTrigger value="text" >Text Input</TabsTrigger>
                    <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <Card className="relative">
                        { loading && <LoadingOverlay /> }
                        <CardHeader>
                            <CardTitle>
                                Text Input
                            </CardTitle>
                            <CardDescription>
                                Copy and paste your notes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form 
                                    onSubmit={form.handleSubmit()} 
                                    className="flex flex-col gap-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="textInput"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        className="resize-none"
                                                        rows={24}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-fit">Generate</Button>
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
                                <form 
                                    onSubmit={form.handleSubmit()}
                                    className="flex flex-col gap-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="fileInput"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Dropzone
                                                        accept={{ 'application/*': ['.pdf'] }}
                                                        maxFiles={20}
                                                        maxSize={1024 * 1024 * 10}
                                                        minSize={1024}
                                                        onDrop={(files) => handleDrop(files, field.onChange)}
                                                        onError={console.error}
                                                        src={file}
                                                        className="h-100"
                                                    >
                                                        <DropzoneEmptyState />
                                                        <DropzoneContent 
                                                            className="w-full"
                                                        />
                                                    </Dropzone>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-fit">Generate</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}