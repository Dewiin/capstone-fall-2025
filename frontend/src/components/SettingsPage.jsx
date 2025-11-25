// components
import { Footer } from "@/components/Footer";
import { useAuth } from "./contexts/Contexts";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

// form 
import { zodResolver } from "@hookform/resolvers/zod"
import { json, z } from "zod"
import { useForm } from "react-hook-form"

// react
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// icons
import { FaUser, FaKey } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import { VscDebugRestart } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { Spinner } from "./ui/shadcn-io/spinner";
import { toast } from "sonner";


// Username and passphrase parameters
const USER_LEN_MINIMUM = 6
const USER_LEN_MAXIMUM = 20
const PASS_LEN_MINIMUM = 10
const PASS_LEN_MAXIMUM = 512
const PRINTABLE_UNICODE = /^[\P{Cc}\P{Cn}\P{Cs}]+$/gu // allow only, printable (unicode) characters; https://stackoverflow.com/a/12054775
const PRINTABLE_MESSAGE = "can only contain printable characters."

// zod validator -> display name
const displayNameSchema = z.object({
    displayName: z.string().min(USER_LEN_MINIMUM, {
        message: "Display name must be at least " + USER_LEN_MINIMUM + " characters.",
    }).max(USER_LEN_MAXIMUM, {
        message: "Display name has a " + USER_LEN_MAXIMUM + " character limit."
    }).regex(PRINTABLE_UNICODE, { 
        message: "Display name " + PRINTABLE_MESSAGE
    }),
})

// zod validator -> password
const passwordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(PASS_LEN_MINIMUM, {
        message: "Password must be at least " + PASS_LEN_MINIMUM + " characters."
    }). max(PASS_LEN_MAXIMUM, {
        message: "Password has a " + PASS_LEN_MAXIMUM + " character limit."
    }).regex(PRINTABLE_UNICODE, { 
        message: "Password " + PRINTABLE_MESSAGE
    }),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"]
});

const allTabs = [
  { tabValue: 'account', label: 'account', icon: <FaUser className="text-xl" /> },
  { tabValue: 'authentication', label: 'authentication', icon: <FaKey className="text-xl" /> },
  { tabValue: 'dangerZone', label: 'danger zone', icon: <PiWarningFill className="text-xl" /> },
];

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function SettingsPage() {
    const [ currentTab, setCurrentTab ] = useState("account");
    const [ loading, setLoading ] = useState("");
    const [ isDialogOpen, setIsDialogOpen ] = useState("");
    const { user, setUser, authLoading } = useAuth();

    const navigate = useNavigate();

    const displayNameForm = useForm({
        resolver: zodResolver(displayNameSchema),
        mode: "onChange",
        defaultValues: {
            displayName: "",
        }
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        }
    })

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/unauthorized");
        }
    }, [authLoading]);

    // account settings functions
    async function handleDisplayName(data) {
        setLoading("displayName");

        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/account/settings/displayName`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            });
            if(!response.ok) {
                toast.warning("There was an error getting a reponse", {
                    description: "Please try again later."
                });
                console.error("Error getting a response for updating name: ", response.status);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                setUser((prev) => ({
                    ...prev,
                    displayName: result.displayName,
                }));
                toast.success("Successfully updated!", {
                    description: 
                    <>
                    You changed your name to <i>{result.displayName}</i>
                    </>
                });
            } else {
                toast.error("There was an error!", {
                    description: "Please try again later."
                });
            }
        } catch(err) {
            toast.warning("Error updating display name", {
                description: "Please try again later."
            });
            console.error("Error updating display name: ", err);
        } finally {
            setLoading("");
        }
    }

    // authentication settings functions
    async function handlePassword(data) {
        setLoading("password");
        
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/account/settings/password`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            });
            if(!response.ok) {
                toast.warning("There was an error getting a reponse", {
                    description: "Please try again later."
                });
                console.error("Error getting a response for updating password: ", response.status);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                toast.success(result.message);
            } else {
                toast.error(result.message, {
                    description: "Please try again."
                });
            }
        } catch(err) {
            toast.warning("Error updating password", {
                description: "Please try again later."
            });
            console.error("Error updating password: ", err);
        } finally { 
            setLoading("");
        }
    }

    return (
        <div
            className="md:mt-16 mt-8 p-4 flex flex-col h-screen"
        >   
            <div
                className="flex-1 flex md:flex-row flex-col gap-12"
            >
                <section
                    className="flex flex-col min-w-3xs h-fit py-4 rounded-2xl 
                    dark:bg-slate-950 bg-indigo-200 
                    border-1 dark:border-indigo-200 border-indigo-950"
                >
                    {allTabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-4 py-4 px-8 text-left
                            ${ currentTab === tab.tabValue ? "dark:text-slate-100 text-slate-950" : "text-slate-500" } 
                            hover:dark:text-slate-100 hover:text-slate-950
                            active:dark:text-slate-500 active:text-slate-500 duration-150`}
                            onClick={() => setCurrentTab(tab.tabValue)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </section>
                <section
                    className="w-full h-full py-4"
                >
                    {/* account settings section */}
                    {currentTab === "account" && 
                        <div className="grid gap-8">
                            {/* update name */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <FaUser className="text-xl" />
                                        <p>
                                            update account name
                                        </p>
                                    </div>
                                    <p>
                                        Change the display name of your account.
                                    </p>    
                                </div>
                                <Dialog open={isDialogOpen === "displayName"} onOpenChange={setIsDialogOpen}>
                                    <button
                                        className="py-2 rounded-lg font-semibold 
                                        text-zinc-300 hover:text-zinc-900
                                        dark:bg-zinc-900 bg-zinc-700
                                        hover:dark:bg-zinc-300 hover:bg-zinc-200
                                        active:dark:bg-zinc-700 active:bg-zinc-400
                                        duration-150"
                                        onClick={() => {
                                            if(loading === "displayName") {
                                                return;
                                            }
                                            setIsDialogOpen("displayName")
                                        }}
                                        >
                                        {loading === "displayName" ? 
                                        <Spinner className="m-auto" />
                                        : 
                                        "update name"
                                        }
                                    </button>
                                    <DialogContent className="sm:max-w-[425px] gap-6">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Update name
                                            </DialogTitle>
                                            <DialogDescription>
                                                This changes your display name <i>NOT</i> your username.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...displayNameForm}>
                                            <form 
                                                onSubmit={displayNameForm.handleSubmit(data => handleDisplayName(data))}
                                            >
                                                <FormField
                                                    control={displayNameForm.control}
                                                    name="displayName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="bg-[rgba(255,255,255,0.3)]" 
                                                                    id="displayName" 
                                                                    type="text" 
                                                                    placeholder={user.displayName}
                                                                    autoComplete="off"
                                                                    {...field} 
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <DialogClose asChild>
                                                    <button
                                                        type="submit"
                                                        className="py-1.5 w-full mt-4 text-sm rounded-sm font-semibold 
                                                        text-zinc-300 hover:text-zinc-900
                                                        dark:bg-zinc-900 bg-zinc-700
                                                        hover:dark:bg-zinc-300 hover:bg-zinc-200
                                                        active:dark:bg-zinc-700 active:bg-zinc-400
                                                        duration-150"
                                                    >
                                                        Confirm
                                                    </button>
                                                </DialogClose>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    }
                    {/* authentication settings section */}
                    {currentTab === "authentication" && 
                        <div className="grid gap-8">
                            {/* Change Password Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <FaLock className="text-xl" />
                                        <p>
                                            password authentication settings
                                        </p>
                                    </div>
                                    <p>
                                        Update your password.
                                    </p>    
                                </div>
                                <Dialog open={isDialogOpen === "password"} onOpenChange={setIsDialogOpen}>
                                    <button
                                        disabled={user?.provider === "google"}
                                        className={`py-2 rounded-lg font-semibold 
                                        text-zinc-300
                                        dark:bg-zinc-900 bg-zinc-700
                                        ${user?.provider === "local" ? 
                                        "hover:dark:bg-zinc-300 hover:bg-zinc-200 active:dark:bg-zinc-700 active:bg-zinc-400 hover:text-zinc-900 duration-150"
                                        :
                                        "cursor-not-allowed"
                                        }`}
                                        onClick={() => {
                                            if(loading === "password") {
                                                return;
                                            }
                                            setIsDialogOpen("password");
                                        }}
                                        >
                                        {loading === "password" ? 
                                        <Spinner className="m-auto" />
                                        : 
                                        "update password"
                                        }
                                    </button>
                                    <DialogContent className="sm:max-w-[425px] gap-6">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Update password
                                            </DialogTitle>
                                        </DialogHeader>
                                        <Form {...passwordForm}>
                                            <form 
                                                className="flex flex-col gap-4"
                                                onSubmit={passwordForm.handleSubmit(data => handlePassword(data))}
                                            >
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="currentPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="bg-[rgba(255,255,255,0.3)]" 
                                                                    id="currentPassword" 
                                                                    type="password" 
                                                                    placeholder="current password"
                                                                    autoComplete="off"
                                                                    {...field} 
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="newPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="bg-[rgba(255,255,255,0.3)]" 
                                                                    id="newPassword" 
                                                                    type="password" 
                                                                    placeholder="new password"
                                                                    autoComplete="off"
                                                                    {...field} 
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="confirmNewPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    className="bg-[rgba(255,255,255,0.3)]" 
                                                                    id="confirmNewPassword" 
                                                                    type="password" 
                                                                    placeholder="confirm new password"
                                                                    autoComplete="off"
                                                                    {...field} 
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <DialogClose asChild>
                                                    <button
                                                        type="submit"
                                                        className="py-1.5 w-full text-sm rounded-sm font-semibold 
                                                        text-zinc-300 hover:text-zinc-900
                                                        dark:bg-zinc-900 bg-zinc-700
                                                        hover:dark:bg-zinc-300 hover:bg-zinc-200
                                                        active:dark:bg-zinc-700 active:bg-zinc-400
                                                        duration-150"
                                                    >
                                                        Confirm
                                                    </button>
                                                </DialogClose>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    }
                    {/* danger zone settings section */}
                    {currentTab === "dangerZone" && 
                        <div className="grid gap-8">
                            {/* Reset Account Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <VscDebugRestart className="text-xl" />
                                        <p>
                                            reset account
                                        </p>
                                    </div>
                                    <p>
                                        Completely resets your account to a blank state.<br />
                                        <span className="text-red-500">You can't undo this action!</span>
                                    </p>    
                                </div>
                                <button
                                    className="py-2 rounded-lg text-slate-950 font-semibold 
                                    dark:bg-red-500 bg-red-400
                                    hover:dark:bg-red-200 hover:bg-red-100
                                    active:dark:bg-gray-500 active:bg-gray-300 
                                    duration-150"
                                    onClick={() => handleResetAccount()}
                                >
                                    reset account
                                </button>
                            </div>

                            {/* Delete Account Section */}
                            <div className="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4 items-center rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MdDelete className="text-xl" />
                                        <p>
                                            delete account
                                        </p>
                                    </div>
                                    <p>
                                        Deletes your account and all data connected to it.<br />
                                        <span className="text-red-500">You can't undo this action!</span>
                                    </p>    
                                </div>
                                <button
                                    className="py-2 rounded-lg text-slate-950 font-semibold 
                                    dark:bg-red-500 bg-red-400
                                    hover:dark:bg-red-200 hover:bg-red-100
                                    active:dark:bg-gray-500 active:bg-gray-300
                                    duration-150"
                                    onClick={() => handleDeleteAccount()}
                                >
                                    delete account
                                </button>
                            </div>
                        </div>
                    }
                </section>
            </div>
            <Footer />
        </div>
    )
}