import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Footer } from "@/components/Footer"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/contexts/Contexts"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useState, useEffect } from "react"

// zod validator
const generateSchema = z.object({
    studySetName: z.string().trim().min(1, {
        message: "Name must be at least a character."
    }).max(50, {
        message: "Name must be less than 50 characters"
    }).regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Name can only contain alphanumeric characters (and space)."
    }),

    textInput: z.string().trim().max(30000, {
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
    const [ file, setFile ] = useState();
    
    // tabs
    const [ uploadType, setUploadType ] = useState("pdf");
    const [ difficulty, setDifficulty ] = useState("beginner");
    const [ visibility, setVisibility ] = useState("public");

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
                body = JSON.stringify({
                    ...data,
                    difficulty,
                    visibility,
                });
                headers["Content-Type"] = "application/json";
            } else if(uploadType === "pdf") {
                body = new FormData();
                body.append("file", file[0]);
                body.append("studySetName", data.studySetName);
                body.append("difficulty", difficulty);
                body.append("visibility", visibility);
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
        <div className="flex flex-col h-full w-full gap-16 items-center mt-24">
            { loading && <LoadingOverlay className="fixed" /> }
            <Tabs 
                defaultValue={uploadType} 
                className="md:w-4xl w-sm"
                onValueChange={(val) => {
                    setUploadType(val);
                }}
            >
                <TabsList
                    className="dark:bg-slate-950 bg-indigo-200 border-1 dark:border-indigo-200 border-indigo-900 mb-4"
                >
                    <TabsTrigger 
                        value="text"
                        className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                    >
                        Text Input
                    </TabsTrigger>
                    <TabsTrigger 
                        value="pdf"
                        className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"    
                    >
                        PDF Upload
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <div className="flex md:flex-row flex-col gap-2">
                        <Card
                            className="md:w-2xs h-fit px-2 box-content
                            dark:bg-slate-950 bg-indigo-200
                            border-1 dark:border-indigo-200 border-indigo-900"
                        >
                            <CardHeader>
                                <CardTitle>
                                    Study Set Options
                                </CardTitle>
                                <CardDescription>
                                    Configurate your study set
                                </CardDescription>
                            </CardHeader>
                            <CardContent
                                className="flex flex-col md:gap-6 gap-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">
                                        Difficulty
                                    </Label>
                                    <Tabs
                                        defaultValue={difficulty}
                                        onValueChange={
                                            (val) => {
                                                setDifficulty(val);
                                            }
                                        }
                                    >
                                        <TabsList
                                            className="dark:bg-[rgba(255,255,255,0.05)]"
                                        >
                                            <TabsTrigger 
                                                value="beginner"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Beginner
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="intermediate"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Intermediate
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="advanced"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Advanced
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="beginner">
                                            <p className="text-xs">
                                                Beginner difficulty will generate around 50% of flash cards as questions.
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="intermediate">
                                            <p className="text-xs">
                                                Intermediate difficulty will generate around 75% of flash cards as questions.
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="advanced">
                                            <p className="text-xs">
                                                Advanced difficulty will generate around 99% of flash cards as questions.
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">
                                        Visibility
                                    </Label>
                                    <Tabs
                                        defaultValue={visibility}
                                        onValueChange={
                                            (val) => {
                                                setVisibility(val);
                                            }
                                        }
                                    >
                                        <TabsList
                                            className="dark:bg-[rgba(255,255,255,0.05)]"
                                        >
                                            <TabsTrigger
                                                value="public"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Public    
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="private"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Private
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="public">
                                            <p className="text-xs">
                                                Public visibility allows other users to see your study set.
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="private">
                                            <p className="text-xs">
                                                Private visibility hides your study set from other users.
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </CardContent>
                        </Card>
                        <Card 
                            className="flex-1 border-1
                                dark:border-indigo-200 border-indigo-900
                                dark:bg-slate-950 bg-indigo-200
                                dark:text-indigo-100 text-indigo-900"
                        >
                            <CardHeader>
                                <CardTitle>
                                    Text Input
                                </CardTitle>
                                <CardDescription className="dark:text-indigo-100 text-gray-600">
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
                                                        <Input
                                                            className="dark:border-indigo-300 border-indigo-900 bg-[rgba(255,255,255,0.3)]" 
                                                            id="studySetName" 
                                                            type="text" 
                                                            placeholder="My Study Set..."
                                                            required 
                                                            {...field} 
                                                        />
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
                                                            className="resize-none dark:border-indigo-300 border-indigo-900 bg-[rgba(255,255,255,0.3)]"
                                                            placeholder="Here goes my notes..."
                                                            rows={20}
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
                    </div>
                </TabsContent>
                <TabsContent value="pdf">
                    <div className="flex md:flex-row flex-col gap-2">
                        <Card
                            className="md:w-2xs h-fit px-2 box-content
                            dark:bg-slate-950 bg-indigo-200
                            border-1 dark:border-indigo-200 border-indigo-900"
                        >
                            <CardHeader>
                                <CardTitle>
                                    Study Set Options
                                </CardTitle>
                                <CardDescription>
                                    Configurate your study set
                                </CardDescription>
                            </CardHeader>
                            <CardContent
                                className="flex flex-col md:gap-6 gap-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">
                                        Difficulty
                                    </Label>
                                    <Tabs
                                        defaultValue={difficulty}
                                        onValueChange={
                                            (val) => {
                                                setDifficulty(val);
                                            }
                                        }
                                    >
                                        <TabsList
                                            className="dark:bg-[rgba(255,255,255,0.05)]"
                                        >
                                            <TabsTrigger 
                                                value="beginner"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Beginner
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="intermediate"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Intermediate
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="advanced"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Advanced
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="beginner">
                                            <p className="text-xs">
                                                Beginner difficulty will generate around 50% of flash cards as questions.
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="intermediate">
                                            <p className="text-xs">
                                                Intermediate difficulty will generate around 75% of flash cards as questions.
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="advanced">
                                            <p className="text-xs">
                                                Advanced difficulty will generate around 99% of flash cards as questions.
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-semibold">
                                        Visibility
                                    </Label>
                                    <Tabs
                                        defaultValue={visibility}
                                        onValueChange={
                                            (val) => {
                                                setVisibility(val);
                                            }
                                        }
                                    >
                                        <TabsList
                                            className="dark:bg-[rgba(255,255,255,0.05)]"
                                        >
                                            <TabsTrigger
                                                value="public"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Public    
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="private"
                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)] text-xs"
                                            >
                                                Private
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="public">
                                            <p className="text-xs">
                                                Public visibility allows other users to see your study set.
                                            </p>
                                        </TabsContent>
                                        <TabsContent value="private">
                                            <p className="text-xs">
                                                Private visibility hides your study set from other users.
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </CardContent>
                        </Card>
                        <Card 
                            className="flex-1 border-1
                                dark:border-indigo-200 border-indigo-900
                                dark:bg-slate-950 bg-indigo-200
                                dark:text-indigo-100 text-indigo-900"
                        >
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
                                                        <Input
                                                            className="dark:border-indigo-300 border-indigo-900 bg-[rgba(255,255,255,0.3)]"  
                                                            id="studySetName" 
                                                            type="text" 
                                                            placeholder="My Study Set..."
                                                            required {...field} 
                                                        />
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
                                                            className="h-100 dark:border-indigo-300 border-indigo-900 bg-[rgba(255,255,255,0.3)]"
                                                        >
                                                            <DropzoneEmptyState 
                                                                className="bg-transparent"
                                                            />
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
                    </div>
                </TabsContent>
            </Tabs>

            {/* Footer */}
            <Footer />
        </div>
    )
}