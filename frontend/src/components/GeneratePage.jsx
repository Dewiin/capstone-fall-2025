import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect, useRef } from "react"
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
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { useAuth } from "@/components/contexts/Contexts"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { RiGeminiFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function GeneratePage() {    
    const navigate = useNavigate();
    const { user, authLoading } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const [ file, setFile ] = useState();
    
    // tabs
    const [ uploadType, setUploadType ] = useState("pdf");
    const [ difficulty, setDifficulty ] = useState("beginner");
    const [ visibility, setVisibility ] = useState("public");
    
    // ai prompt
    const [ chatHistory, setChatHistory ] = useState([]);
    const [ promptSubmitted, setPromptSubmitted ] = useState(false);
    const chatRef = useRef(null);
    
    // zod schemas
    const generateSchema = z.object({
        studySetName: z.string().trim().min(1, {
            message: "Name must be at least a character."
        }).max(50, {
            message: "Name must be less than 50 characters"
        }).regex(/^[a-zA-Z0-9 ]+$/, {
            message: "Name can only contain alphanumeric characters (and space)."
        }).optional(),
    
        textInput: z.string().trim().max(30000, {
            message: "Text must be less than 30,000 characters."
        }).optional(),
    
        fileInput: z.array(z.instanceof(File)).max(1, {
            message: "You can only upload one file."
        }).optional(),
    
        promptInput: z.string()
    });

    const promptSchema = z.object({
        promptInput: z.string(),
    });

    // forms
    const form = useForm({
        resolver: zodResolver(generateSchema),
        mode: "onChange",
        defaultValues: {
            studySetName: "",
            textInput: "",
        }
    });

    const promptForm = useForm({
        resolver: zodResolver(promptSchema),
        mode: "onChange",
        defaultValues: {
            promptInput: "",
        }
    });

    useEffect(() => {
        if(!authLoading && !user) {
            navigate("/unauthorized");
        }
    }, [authLoading]);
    
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory]);

    function handleDrop(files, onChange) {
        if (files && files.length == 1) {
            setFile(files);
        }
        
        onChange(files);
    }
    
    async function handleSubmit(data) {
        const promise = onSubmit(data);

        toast.promise(promise, {
            loading: "Generating your study set...",
        });
    }

    async function onSubmit(data) {
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
                toast.warning("Please try again later.", {
                    description: "There was an error getting a response from the server."
                });
                return;
            }

            const result = await response.json();

            if(result.status == 1) {
                toast.success("Study set created successfully!", {
                    description: "Your new study set is in your account page.",
                    action: {
                        label: "View",
                        onClick: () => navigate(`/study-set/${result.studySetId}`)
                    }
                });
            } else {
                toast.warning("Failed to create the study set", {
                    description: "Try again and add more details to the input.",
                });
                console.error(`Error submitting data for generation.`);
            }

        } catch (err) {
            toast.warning("Please try again later.", {
                description: "There was an error submitting your request to the server."
            });
            console.error(`Error submitting data for generation: `, err);
        }
    }

    async function handlePromptSubmit(data) {
        setPromptSubmitted(true);

        setChatHistory((prev) => ([
            ...prev,
            {
                role: "user",
                text: data.promptInput
            }
        ]));

        try {
            const body = JSON.stringify({
                ...data,
                chatHistory,
            });

            const response = await fetch(`${API_URL_DOMAIN}/api/generate/${uploadType}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body,
                credentials: "include",
            });
            if(!response.ok) {
                toast.warning("Please try again later.", {
                    description: "There was an error getting a response from the server."
                });
                console.error("There was an error handling prompt submission: ", response.status);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                setChatHistory((prev) => ([
                    ...prev,
                    {
                        role: "model",
                        text: result.output,
                    }
                ]));
                setPromptSubmitted(false);
            } else if(result.status === 2) {
                setChatHistory((prev) => ([
                    ...prev,
                    {
                        role: "model",
                        text: "Generating a study set for you now...",
                    }
                ]));
                const promise = onPromptSubmit({
                    ...data,
                    ...result,
                });

                toast.promise(promise, {
                    loading: "Generating your study set...",
                });
            } else {
                toast.warning("Please try again later.", {
                    description: "There was an error submitting your request to the server."
                });
                console.error(`Error submitting data for generation: `, err);
            }

        } catch (err) {
            toast.warning("Please try again later.", {
                description: "There was an error submitting your request to the server."
            });
            console.error(`Error submitting data for generation: `, err);
        } finally {
            setChatHistory((prev) => (
                prev.slice(-10)
            ));
        }
    }

    async function onPromptSubmit(data) {
        try {
            const body = JSON.stringify({
                ...data,
                difficulty,
                visibility,
            });
            const response = await fetch(`${API_URL_DOMAIN}/api/generate/${uploadType}/create`, {
                method: "POST",
                body,
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            }); 
            if(!response.ok) {
                toast.warning("Please try again later.", {
                    description: "There was an error getting a response from the server."
                });
                console.error("There was an error handling prompt submission: ", response.status);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                toast.success("Study set created successfully!", {
                    description: "Your new study set is in your account page.",
                    action: {
                        label: "View",
                        onClick: () => navigate(`/study-set/${result.studySetId}`)
                    }
                });
            } else {
                toast.warning("Failed to create the study set", {
                    description: "Try again and add more details to your prompt.",
                });
                console.error(`Error submitting data for generation.`);
            }
        } catch (err) {
            toast.warning("Please try again later.", {
                description: "There was an error submitting your request to the server."
            });
            console.error(`Error submitting data for generation: `, err);
        } finally {
            setPromptSubmitted(false);
        }
    }

    return (
        <div className="flex flex-col gap-8 h-full w-full items-center mt-24">
            { loading && <LoadingOverlay className="fixed" /> }
            <p className="font-bold text-2xl text-center">Generate.</p>

            {/* Disclaimer Section */}
            <section 
            className="w-full max-w-4xl mx-auto p-6 bg-indigo-50 dark:bg-indigo-950 rounded-3xl shadow-sm"
            id="disclaimer"
            >
            <h2 className="text-xl font-bold mb-6 text-center dark:text-gray-100">Powered by Gemini</h2>

            <div className="text-left text-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Brainstorm uses <strong>Google’s Gemini AI</strong> to enhance your studying experience. 
                Please use this tool responsibly. It is designed to help you learn and study more effectively.
                </p>

                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <li>Don’t use Brainstorm or Gemini for harmful, offensive, or abusive content.</li>
                <li>Use this platform for studying, learning, and educational purposes only.</li>
                <li>Be mindful that AI responses may not always be 100% accurate.</li>
                </ul>

                <p className="text-gray-700 dark:text-gray-300">
                To learn more about Gemini, visit{" "}
                <a 
                    href="https://gemini.google/about/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-500 hover:underline"
                >
                    Google Gemini
                </a>.
                </p>
            </div>
            </section>

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
                    <TabsTrigger 
                        value="prompt"
                        className="data-[state=active]:bg-[rgba(255,255,255,0.5)] gap-1"    
                    >
                        <RiGeminiFill/> 
                        <p>
                            AI Prompt
                        </p>
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
                                dark:text-indigo-100"
                        >
                            <CardHeader>
                                <CardTitle>
                                    Text Input
                                </CardTitle>
                                <CardDescription>
                                    Create a study set with raw text
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form 
                                        onSubmit={form.handleSubmit(handleSubmit)} 
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
                                                            className="bg-[rgba(255,255,255,0.3)]" 
                                                            id="studySetName" 
                                                            type="text" 
                                                            placeholder="My Study Set..."
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
                                            control={form.control}
                                            name="textInput"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel> Text </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className="resize-none bg-[rgba(255,255,255,0.3)]"
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
                                dark:text-indigo-100"
                        >
                            <CardHeader>
                                <CardTitle>
                                    PDF Upload
                                </CardTitle>
                                <CardDescription>
                                    Create a study set with a PDF file
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form 
                                        onSubmit={form.handleSubmit(handleSubmit)}
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
                                                            className="bg-[rgba(255,255,255,0.3)]"  
                                                            id="studySetName" 
                                                            type="text" 
                                                            placeholder="My Study Set..."
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
                                                            className="h-100 bg-[rgba(255,255,255,0.3)]"
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
                <TabsContent value="prompt">
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
                                dark:text-indigo-100"
                        >
                            <CardHeader>
                                <CardTitle>
                                    AI Prompt
                                </CardTitle>
                                <CardDescription>
                                    Create a study set with an AI prompt
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...promptForm}>
                                    <form 
                                        onSubmit={promptForm.handleSubmit((data) => {
                                            promptForm.resetField("promptInput", {
                                                defaultValue: "",
                                            });
                                            handlePromptSubmit(data);
                                        })} 
                                        className="flex flex-col gap-6"
                                    >
                                        <div
                                            className="flex flex-col gap-2"
                                        >
                                            <FormLabel>
                                                Chat Prompt History
                                            </FormLabel>
                                            <div
                                                className="border-1 border-input p-2 rounded-lg 
                                                bg-[rgba(255,255,255,0.03)]"
                                            >
                                                <div 
                                                    ref={chatRef}
                                                    className="max-h-50 min-h-35 overflow-y-scroll flex flex-col gap-1 pb-2"
                                                    >
                                                    { chatHistory.length === 0 && 
                                                    <p className="text-sm m-auto">
                                                        <i>
                                                            Chat history is empty.
                                                        </i>
                                                    </p> }
                                                    { chatHistory.length > 0 &&
                                                        chatHistory.map((message, index) => (
                                                            <div
                                                                key={index}
                                                                className={`${message.role === "user" ? "self-end dark:bg-slate-900 bg-indigo-100" : "self-start"} 
                                                                max-w-75 border-1 rounded-lg px-4 py-2 text-sm`}
                                                            >   
                                                                {message.text}
                                                            </div>
                                                        ))
                                                    }
                                                    { promptSubmitted && 
                                                    <div
                                                        className="self-start max-w-75 border-1 rounded-lg px-4 py-2 text-sm"
                                                    >   
                                                        <Spinner variant="ellipsis" size={16} />
                                                    </div>
                                                    }
                                                </div>
                                                <FormField
                                                    control={promptForm.control}
                                                    name="promptInput"
                                                    render={({ field }) => (
                                                        <FormItem
                                                        className={`${promptSubmitted && "cursor-not-allowed"}`}
                                                        >
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Input
                                                                        className="bg-[rgba(255,255,255,0.3)] pr-10"
                                                                        placeholder="What topics would you like to study?"
                                                                        autoComplete="off"
                                                                        disabled={promptSubmitted}
                                                                        required
                                                                        {...field}
                                                                        />
                                                                    <button
                                                                        type="submit"
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                                        >
                                                                        <IoSend className={`${promptSubmitted ? "cursor-not-allowed text-neutral-700" : "cursor-pointer"}`} />
                                                                    </button>
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
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