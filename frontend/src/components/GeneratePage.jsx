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
    studySetName: z.string().trim().min(1, {
        message: "Name must be at least a character."
    }).max(50, {
        message: "Name must be less than 50 characters"
    }).regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Name can only contain alphanumeric characters (and space)."
    }),

    textInput: z.string().trim().min(300, {
        message: "Text must be at least 300 characters."
    }).max(30000, {
        message: "Text must be less than 30,000 characters."
    }).optional(),

    fileInput: z.array(z.instanceof(File)).max(1, {
        message: "You can only upload one file."
    }).optional(),
});

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function GeneratePage() {    
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const [ uploadType, setUploadType ] = useState("text");
    const [ file, setFile ] = useState();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, []);

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

    async function onSubmit(data) {
        setLoading(true);
        
        try {
            let body;
            let headers = {};

            if(uploadType === "text") {
                body = JSON.stringify(data);
                headers["Content-Type"] = "application/json";
            } else if(uploadType === "pdf") {
                body = new FormData();
                body.append("file", file[0]);
                body.append("studySetName", data.studySetName);
            }
            
            const response = await fetch(`${API_URL_DOMAIN}/api/generate/${uploadType}`, {
                method: "POST",
                headers,
                body,
                credentials: "include",
            });
            if (!response.ok) {
                setLoading(false);
                return;
            }

            const result = await response.json();

            if(result.status == 1) {
                navigate(`/study-set/${result.studySetId}`);
            } else {
                console.error(`Error submitting data for generation: `, err);
            }

        } catch (err) {
            console.error(`Error submitting data for generation: `, err);
        } finally {
            setLoading(false);
        }
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
                                Create a Study Set With Raw Text
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form 
                                    onSubmit={form.handleSubmit(onSubmit)} 
                                    className="flex flex-col gap-6"
                                >
                                    <FormField 
                                        control={form.control}
                                        name="studySetName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel> Study Set Name </FormLabel>
                                                <FormControl>
                                                    <Input id="studySetName" type="text" required {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="textInput"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel> Text </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        className="resize-none"
                                                        rows={24}
                                                        required
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
                                Create a Study Set With PDF
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form 
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex flex-col gap-6"
                                >
                                    <FormField 
                                        control={form.control}
                                        name="studySetName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel> Study Set Name </FormLabel>
                                                <FormControl>
                                                    <Input id="studySetName" type="text" required {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="fileInput"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel> PDF </FormLabel>
                                                <FormControl type="file">
                                                    <Dropzone
                                                        accept={{ 'application/*': ['.pdf'] }}
                                                        maxFiles={200}
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