import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Footer } from "@/components/Footer";
import {
    Card, 
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { 
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { FaHeart, FaRegHeart, FaRegEdit, FaSearch } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CountingNumber } from "./ui/shadcn-io/counting-number";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

// zod validator
const studySetSchema = z.object({
    studySetName: z.string().trim().min(1, {
        message: "Name must be at least a character."
    }).max(50, {
        message: "Name must be less than 50 characters"
    }).regex(/^[a-zA-Z0-9 ]+$/, {
        message: "Name can only contain alphanumeric and whitespace characters."
    }),
});

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function AccountPage() {
    const { user, authLoading } = useAuth();

    // backend
    const [ flashcardCount, setFlashcardCount ] = useState(0);
    const [ attemptCount, setAttemptCount ] = useState(0);
    const [ createdAt, setCreatedAt ] = useState(null);
    const [ accountUser, setAccountUser ] = useState(null);
    const [ accountFollowers, setAccountFollowers ] = useState([]);
    const [ accountFollowing, setAccountFollowing ] = useState([]);
    
    // frontend
    const [ accountTab, setAccountTab ] = useState("studySets");
    const [ loading, setLoading ] = useState(false);
    const [ singleLoading, setSingleLoading ] = useState(null);
    const navigate = useNavigate();

    // form
    const [ visibilityChanged, setVisibilityChanged ] = useState(false);

    const form = useForm({
        resolver: zodResolver(studySetSchema),
        mode: "onChange",
        defaultValues: {
            studySetName: "",
        }
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate("/unauthorized");
            } else {
                getAccount();
            }
        }
    }, [authLoading]);

    async function getAccount() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/account/${user.id}`, {
                method: "GET",
                credentials: "include",
            });
            if(!response.ok) {
                console.error(`Error getting a response for study set: `, response.status);
                return;
            }

            const result = await response.json();

            if(result.status == 1) {
                setAccountUser(result.user);
                setAccountFollowers(result.user.followers);
                setAccountFollowing(result.user.following);

                setFlashcardCount(result.flashcardCount);
                setAttemptCount(result.attemptCount);
                setCreatedAt(result.createdAt);
            }
        } catch (err) {
            console.error(`Error getting account info: `, err);
        }
        finally {
            setLoading(false);
        }
    }

    function handleDelete(studySet) {
        setSingleLoading(studySet.id);

        const deletedStudySet = accountUser.studySets.find(s => s.id === studySet.id);
        const wasFavorite = accountUser.favorites.some(f => f.id === studySet.id);
        const deletedFavorite = wasFavorite ? accountUser.favorites.find(s => s.id === studySet.id) : null;

        setAccountUser((prev) => ({
            ...prev,
            studySets: prev.studySets.filter((s) => s.id !== studySet.id),
            favorites: prev.favorites.filter((f) => f.id !== studySet.id)
        }));

        setFlashcardCount((prev) => prev - studySet.deck.cards.length);
        setAttemptCount((prev) => prev - studySet.quiz.attempts.length);

        const undoToastId = toast("Study Set has been deleted", {
            description: "You can undo this action within 5 seconds.",
            duration: 5000,
            action: {
                label: "Undo",
                onClick: () => {
                    clearTimeout(deleteTimer);
                    setAccountUser((prev) => ({
                        ...prev,
                        studySets: [...prev.studySets, {
                            ...deletedStudySet,
                            favoritedBy: deletedStudySet.favoritedBy,
                            quiz: deletedStudySet.quiz,
                            deck: deletedStudySet.deck,
                        }],
                        favorites: wasFavorite ? [...prev.favorites, {
                            ...deletedFavorite,
                            user: deletedFavorite.user,
                            favoritedBy: deletedFavorite.favoritedBy,
                            quiz: deletedFavorite.quiz,
                            deck: deletedFavorite.deck,
                        }] : prev.favorites,
                    }));
                    setFlashcardCount((prev) => prev + studySet.deck.cards.length);
                    setAttemptCount((prev) => prev + studySet.quiz.attempts.length);
                    toast.dismiss(undoToastId);
                    toast.success("Deletion undone!")
                }
            }
        })

        const deleteTimer = setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL_DOMAIN}/api/study-set/${studySet.id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if(!response.ok) {
                    toast.error("Failed to get a response", {
                        description: "Please try again later.",
                    });
                    console.error(`Error getting response for deleting study set: `, response.status);
                    return;
                }
    
                const result = await response.json();
                if(result.status == 1) {
                    toast.error("Removed study set!", {
                        description: (
                        <>
                            <i>{studySet.name}</i> has been permanently deleted.
                        </>
                        ),
                    });
                }
                else {
                    console.error("Error finding study set to delete");
                }
            } catch (err) {
                toast.warning("Failed to get a response", {
                    description: ("Please try again later."),
                });
                console.error(`Error deleting study set: `, err);
            } 
        }, 5500);
        
        setSingleLoading(null);
    }

    async function handleFavorite(studySet) {
        setSingleLoading(studySet.id);
        try {
            const alreadyFavorited = studySet.favoritedBy.some((userInfo) => userInfo.id === user.id);
            const query = alreadyFavorited ? "favorited=true" : "favorited=false"

            const response = await fetch(`${API_URL_DOMAIN}/api/account/${user.id}/favorite/${studySet.id}?${query}`, {
                method: "POST",
                credentials: "include",
            });
            if(!response.ok) {
                console.error(`Error getting a response for favoriting: `, response.status);
            }

            const result = await response.json();
            if(result.status == 1) {
                setAccountUser((prev) => ({
                    ...prev,
                    studySets: prev.studySets.map((s) => (
                        s.id === studySet.id 
                        ? {
                            ...s,
                            favoritedBy: !alreadyFavorited
                            ? [...s.favoritedBy, accountUser]
                            : s.favoritedBy.filter(u => u.id !== user.id)
                        }
                        : s
                    )),
                    favorites: !alreadyFavorited
                    ? [...prev.favorites, {
                        ...studySet,
                        user: accountUser,
                        favoritedBy: [
                            ...studySet.favoritedBy,
                            accountUser,
                        ]
                    }]
                    : prev.favorites.filter(f => f.id !== studySet.id)
                }));
                {
                    alreadyFavorited && toast.error("Removed from favorites!", {
                        description: (
                        <>
                            Successfully unfavorited <i>{studySet.name}</i>
                        </>
                        ),
                    });
                }
                {
                    !alreadyFavorited && toast.success("Added to favorites!", {
                        description: (
                        <>
                            Successfully favorited <i>{studySet.name}</i>
                        </>
                        ),
                    });
                }
            }
        } catch (err) {
            toast.warning("Failed to get a response", {
                description: ("Please try again later."),
            });
            console.error(`Error favoriting study set: `, err);
        } finally {
            setSingleLoading(null);
        }
    }

    async function handleUnfavorite(studySet) {
        setSingleLoading(studySet.id);
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/account/${user.id}/favorite/${studySet.id}?favorited=true`, {
                method: "POST",
                credentials: "include",
            });
            if(!response.ok) {
                toast.warning("Please try again later.", {
                    description: "There was an error getting a response from the server."
                });
                console.error(`Error getting a response for unfavoriting: `, response.status);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                setAccountUser((prev) => ({
                    ...prev,
                    studySets: prev.studySets.map((s) => (
                        s.id === studySet.id 
                        ? {
                            ...s,
                            favoritedBy: s.favoritedBy.filter((u) => u.id !== user.id),
                        }
                        : s
                    )),
                    favorites: prev.favorites.filter((f) => f.id !== studySet.id),
                }));
                    
                toast.error("Removed from favorites!", {
                    description: (
                    <>
                        Successfully unfavorited <i>{studySet.name}</i>
                    </>
                    ),
                });
            }
        } catch (err) {
            toast.warning("Failed to get a response", {
                description: ("Please try again later."),
            });
            console.error(`Error unfavoriting study set: `, err);
        } finally {
            setSingleLoading(null);
        }
    }

    async function handleEdit(studySet, data) {
        setSingleLoading(studySet.id);

        const visibility = {
            true: !studySet.public,
            false: studySet.public,
        }
        
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/account/${user.id}/edit/${studySet.id}`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    ...data,
                    "studySetVisibility": visibility[visibilityChanged],
                }),
            });

            if(!response.ok) {
                toast.warning("Please try again later.", {
                    description: "There was an error getting a response from the server."
                });
                console.error(`Error getting a response for favoriting: `, response.status);
                setSingleLoading(null);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                setAccountUser((prev) => ({
                    ...prev,
                    studySets: prev.studySets.map((s) => (
                        s.id === studySet.id ? result.studySet : s
                    )),
                    favorites: prev.favorites.map((f) => (
                        f.id === studySet.id ? result.studySet  : f
                    )),
                }));
                setVisibilityChanged(false);
                toast.success(`Successfully edited!`, {
                    description: 
                    <>
                        <i>{studySet.name}</i> has been edited.
                    </>
                });
            }
        } catch (err) {
            toast.warning("Please try again later.", {
                description: "There was an error editing your study set."
            });
            console.error(`Error editing study set: `, err);
        } finally {
            setSingleLoading(null);
        }
    }

    async function handleFollowSearch(val, tab) {
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/account/${accountUser.id}/search/${tab}?search_query=${val}`, {
                method: "POST",
                credentials: "include",
            });
            if(!response.ok) {
                toast.warning("There was an error getting a response", {
                    description: "Please try again later."
                });
            }

            const result = await response.json();
            if(result.status === 1) {
                if (tab === "followers") {
                    setAccountFollowers(result.userFollowers); 
                } else if(tab === "following") {
                    setAccountFollowing(result.userFollowing);
                }
            } else {
                toast.warning("There was an error!", {
                    description: "Please try again later."
                });
            }

        } catch (err) {
            toast.warning("Error handling search request", {
                description: "Please try again later."
            });
            console.error(`Error handling search request: `, err);
        }
    }

    return (
        <div className="flex flex-col md:mx-24 md:mt-24 mx-8 mt-8 mb-0 md:gap-16 gap-8 min-h-screen">
            <div className="flex flex-col gap-2">
                {/* First Section */}
                <section className='flex md:flex-row flex-col gap-8 p-4 rounded-lg md:h-30 select-none
                    bg-indigo-200 dark:bg-slate-950 
                    border-1 border-indigo-900 dark:border-indigo-300'
                >
                    {/* Avatar/Name */}
                    <div className="flex gap-4 items-center md:max-w-1/4 text-indigo-900 dark:text-indigo-200">
                        <Avatar className="size-20 rounded-2xl">
                            <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                            <AvatarFallback>Icon</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2 truncate">
                            { loading && 
                            <>
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-4 w-[100px]" />
                            </>
                            }
                            { !loading &&
                            <>
                                <p className="text-3xl font-semibold truncate">
                                    {user?.displayName}
                                </p>
                                <p className="text-xs">
                                    Joined {createdAt ? createdAt : "..."}
                                </p>
                            </>
                            }
                        </div>
                    </div>

                    {/* Divider */}
                    <Separator orientation="vertical" className="hidden md:block border-3 rounded-xl border-indigo-300" />

                    {/* Personal Stats */}
                    <div className=" flex-1 grid md:grid-cols-4 grid-cols-2 md:gap-0 gap-4 items-center text-indigo-900 dark:text-indigo-100">
                        <span>
                            <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                study sets created
                            </p>
                            <CountingNumber 
                                number={ accountUser ? accountUser.studySets.length : 0 }
                                className="md:text-4xl text-2xl font-semibold"
                            />
                        </span>
                        <span>
                            <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                flash cards created
                            </p>
                            <CountingNumber 
                                number={ flashcardCount }
                                className="md:text-4xl text-2xl font-semibold"
                            />
                        </span>
                        <span>
                            <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                quiz attempts recorded
                            </p>
                            <CountingNumber 
                                number={ attemptCount }
                                className="md:text-4xl text-2xl font-semibold"
                                />
                        </span>
                        <span>
                            <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                favorites added
                            </p>
                            <CountingNumber 
                                number={ accountUser ? accountUser.favorites.length : 0 }
                                className="md:text-4xl text-2xl font-semibold"
                                />
                        </span>
                    </div>
                </section>  

                {/* Followers Section */}
                <section
                    className='p-4 rounded-lg min-w-55 max-w-fit select-none flex flex-col gap-4 
                    bg-indigo-200 dark:bg-slate-950 
                    border-1 border-indigo-900 dark:border-indigo-300
                    relative'
                >
                    { loading && <LoadingOverlay /> }
                    <div
                        className="flex justify-evenly
                        dark:text-indigo-300 text-indigo-900 text-sm font-semibold"
                        >
                            <Dialog>
                                <DialogTrigger asChild>
                                    <p className="cursor-pointer">
                                        { accountUser ? accountUser.followers.length : 0 } followers
                                    </p>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] gap-6">
                                    <DialogHeader>
                                        <DialogTitle>Followers</DialogTitle>
                                        <Separator />
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input 
                                                type="text" 
                                                placeholder="Search" 
                                                onChange={(e) => {
                                                    if(e.target.value.trim().length === 0) {
                                                        setAccountFollowers(accountUser.followers);
                                                    } else {
                                                        handleFollowSearch(e.target.value, "followers");
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    if(e.target.value.trim().length === 0) {
                                                        setAccountFollowers(accountUser.followers);
                                                    } else {
                                                        handleFollowSearch(e.target.value, "followers");
                                                    }
                                                }}
                                                className="pl-10
                                                dark:bg-slate-900 bg-[rgba(255,255,255,0.4)] border-none
                                                hover:dark:bg-slate-800 hover:bg-indigo-200 transition duration-50"
                                            />
                                        </div>
                                    </DialogHeader>
                                    <div 
                                        className="flex flex-col gap-6 md:h-100 h-75 overflow-y-scroll"
                                    >
                                        { accountUser?.followers.length == 0 && 
                                        <p className="text-center text-sm">
                                            You currently have no followers.
                                        </p>
                                        }
                                        { (accountFollowers.length === 0 && accountUser?.followers.length > 0) &&
                                        <p className="text-center text-sm">
                                            No results found.
                                        </p>
                                        }
                                        { accountFollowers.map((f) => (
                                            <div
                                                key={f.follower.id}
                                                className="flex justify-between items-center font-semibold text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="size-9 rounded-2xl border-1">
                                                        <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                                                        <AvatarFallback>Icon</AvatarFallback>
                                                    </Avatar>
                                                    {f.follower.displayName}
                                                </div>
                                                <DialogClose asChild>
                                                    <button
                                                        className={`px-4 py-1 rounded-lg font-semibold w-fit h-fit
                                                            text-zinc-900 hover:text-zinc-300
                                                            dark:bg-zinc-200 bg-zinc-300
                                                            hover:dark:bg-slate-900 hover:bg-slate-700
                                                            active:dark:bg-zinc-700 active:bg-zinc-400 
                                                            text-xs duration-150`}
                                                            onClick={() => {
                                                                navigate(`/profile/${f.follower.id}`)
                                                            }}
                                                            >
                                                        View
                                                    </button>
                                                </DialogClose>
                                            </div>
                                        )) }
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <p className="cursor-pointer">
                                        { accountUser ? accountUser.following.length : 0 } following
                                    </p>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] gap-6">
                                    <DialogHeader>
                                        <DialogTitle>Following</DialogTitle>
                                        <Separator />
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input 
                                                type="text" 
                                                placeholder="Search" 
                                                onChange={(e) => {
                                                    if(e.target.value.trim().length === 0) {
                                                        setAccountFollowing(accountUser.following);
                                                    } else {
                                                        handleFollowSearch(e.target.value, "following");
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    if(e.target.value.trim().length === 0) {
                                                        setAccountFollowing(accountUser.following);
                                                    } else {
                                                        handleFollowSearch(e.target.value, "following");
                                                    }
                                                }}
                                                className="pl-10
                                                dark:bg-slate-900 bg-[rgba(255,255,255,0.4)] border-none
                                                hover:dark:bg-slate-800 hover:bg-indigo-200 transition duration-50"
                                            />
                                        </div>
                                    </DialogHeader>
                                    <div 
                                        className="flex flex-col gap-6 md:h-100 h-75 overflow-y-scroll"
                                    >
                                        { accountUser?.following.length == 0 && 
                                        <p className="text-center text-sm">
                                            <i>{accountUser?.displayName}</i> currently follows no profiles.
                                        </p>
                                        }
                                        { (accountFollowing.length === 0 && accountUser?.following.length > 0) &&
                                        <p className="text-center text-sm">
                                            No results found.
                                        </p>
                                        }
                                        { accountFollowing.map((f) => (
                                            <div
                                                key={f.following.id}
                                                className="flex justify-between items-center font-semibold text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="size-9 rounded-2xl border-1">
                                                        <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                                                        <AvatarFallback>Icon</AvatarFallback>
                                                    </Avatar>
                                                    {f.following.displayName}
                                                </div>
                                                <DialogClose asChild>
                                                    <button
                                                        className={`px-4 py-1 rounded-lg font-semibold w-fit h-fit
                                                            text-zinc-900 hover:text-zinc-300
                                                            dark:bg-zinc-200 bg-zinc-300
                                                            hover:dark:bg-slate-900 hover:bg-slate-700
                                                            active:dark:bg-zinc-700 active:bg-zinc-400 
                                                            text-xs duration-150`}
                                                            onClick={() => {
                                                                navigate(`/profile/${f.following.id}`)
                                                            }}
                                                    >
                                                        View
                                                    </button>
                                                </DialogClose>
                                            </div>
                                        )) }
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>
            </div>

            {/* Second Section */}
            <section className="flex-1 flex">
                <Tabs 
                    defaultValue={accountTab}
                    onValueChange={(val) => setAccountTab(val)}
                    className="flex-1"
                >
                    <TabsList
                        className="dark:bg-slate-950 bg-indigo-200 border-1 dark:border-indigo-200 border-indigo-900 mb-4"
                    >
                        <TabsTrigger 
                            value="studySets" 
                            className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                        >
                            Study Sets
                        </TabsTrigger>
                        <TabsTrigger 
                            value="favorites" 
                            className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                        >
                            Favorites
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="studySets">
                        <Card
                            className="w-full h-full border-1 
                                dark:border-indigo-200 border-indigo-900
                                dark:bg-slate-950 bg-indigo-200"
                        >
                            <CardHeader>
                                <CardTitle>
                                    My Study Sets
                                </CardTitle>
                                <CardDescription>
                                    Collection of my study sets
                                </CardDescription>
                            </CardHeader>
                            <CardContent
                                className={`${!accountUser?.studySets || accountUser?.studySets.length === 0 ? "flex justify-center" : "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1" } gap-2 relative`}
                            >
                                { loading && <LoadingOverlay className="md:my-24 my-12" /> }
                                { !accountUser?.studySets || accountUser?.studySets.length === 0 && 
                                    <p className="text-md dark:text-gray-300 text-gray-700 text-center md:my-24 my-12">
                                        No study sets. Create one from the 'Generate' tab!
                                    </p>
                                }
                                { !loading && accountUser?.studySets.map((studySet) => (
                                    <Card
                                        key={studySet.id}
                                        className="border-none cursor-pointer relative
                                        dark:bg-slate-900 bg-indigo-100 
                                        hover:dark:bg-slate-800 hover:bg-blue-200 duration-150"
                                        onClick={() => navigate(`/study-set/${studySet.id}`)}
                                    >
                                        { singleLoading === studySet.id && <LoadingOverlay /> }
                                        <CardHeader className="gap-1">
                                            <CardTitle className="font-bold">
                                                {studySet.name}
                                            </CardTitle>
                                            <CardDescription
                                                className="dark:text-indigo-300 text-slate-900 flex flex-col gap-1"
                                            >
                                                <p>
                                                    {studySet.deck.cards.length} flashcards 
                                                    • {studySet.quiz.attempts.length} quiz attempts
                                                </p>
                                                <div className="flex gap-2">
                                                    <p className={`w-fit px-2 rounded-xl text-xs
                                                        ${studySet.public ? "dark:bg-indigo-300 bg-indigo-300" : "dark:bg-slate-950 bg-indigo-900" }
                                                        ${studySet.public ? "dark:text-indigo-900 text-indigo-950" : "dark:text-indigo-200 text-indigo-200" }`}
                                                    >
                                                        {studySet.public ? "Public " : "Private "}
                                                    </p>
                                                    <p className={`w-fit px-2 rounded-xl text-xs
                                                        ${studySet.difficulty === "BEGINNER" && "dark:bg-green-900 bg-green-300 dark:text-white text-black" }
                                                        ${studySet.difficulty === "INTERMEDIATE" && "dark:bg-yellow-700 bg-yellow-500 dark:text-white text-black" }}
                                                        ${studySet.difficulty === "ADVANCED" && "dark:bg-red-900 bg-red-300 dark:text-white text-black"}`}
                                                    >
                                                        {studySet.difficulty.charAt(0) + studySet.difficulty.slice(1).toLowerCase()}
                                                    </p>
                                                </div>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex justify-between items-center">
                                            <div className="justify-start flex gap-1">
                                                <MdDeleteOutline 
                                                    className="p-2 box-content rounded-lg
                                                    hover:dark:bg-red-800 hover:bg-red-300 duration-150" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(studySet);
                                                    }}    
                                                />
                                            </div>
                                            <div 
                                                className="flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Dialog className="z-10000">
                                                    <DialogTrigger
                                                        asChild
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <FaRegEdit 
                                                            className="p-2 box-content rounded-lg
                                                            hover:dark:bg-slate-700 hover:bg-blue-300 duration-150" 
                                                        />
                                                    </DialogTrigger>
                                                    <DialogContent 
                                                        className="sm:max-w-[425px] dark:bg-slate-950 bg-indigo-200
                                                        border-1 dark:border-indigo-200 border-indigo-900"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Form {...form}>
                                                            <form
                                                                onSubmit={form.handleSubmit((data) => handleEdit(studySet, data))}
                                                            >
                                                                <div className="grid gap-4">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Edit <i>{studySet.name}</i></DialogTitle>
                                                                        <DialogDescription>
                                                                            Make changes to your study set here.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
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
                                                                                        placeholder={studySet.name}
                                                                                        autoComplete="off"
                                                                                        {...field} 
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    <FormField 
                                                                        control={form.control}
                                                                        name="studySetVisibility"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel> Visibility </FormLabel>
                                                                                <FormControl>
                                                                                    <Tabs
                                                                                        onValueChange={() => setVisibilityChanged(prev => !prev)}
                                                                                        defaultValue={visibilityChanged ? 
                                                                                            (studySet.public ? "private" : "public")
                                                                                            : (studySet.public ? "public" : "private") 
                                                                                        }
                                                                                    >
                                                                                        <TabsList>
                                                                                            <TabsTrigger 
                                                                                                value="public"
                                                                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                                                                                            >
                                                                                                Public
                                                                                            </TabsTrigger>
                                                                                            <TabsTrigger 
                                                                                                value="private"
                                                                                                className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"    
                                                                                            >
                                                                                                Private
                                                                                            </TabsTrigger>
                                                                                        </TabsList>
                                                                                    </Tabs>
                                                                                </FormControl>
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button 
                                                                            variant="outline"
                                                                            className="bg-indigo-100"
                                                                            >
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <DialogClose asChild>
                                                                        <Button 
                                                                            type="submit"
                                                                        >
                                                                            Save changes
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </form>
                                                        </Form>
                                                    </DialogContent>
                                                </Dialog>
                                                <p
                                                    className="flex justify-end items-center gap-1 text-sm font-semibold p-2 rounded-lg 
                                                    hover:dark:bg-slate-700 hover:bg-blue-300 duration-150
                                                    dark:text-indigo-100 text-indigo-950"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFavorite(studySet);
                                                    }}
                                                >
                                                    { studySet.favoritedBy.some((userInfo) => userInfo.id === user.id) ? (
                                                        <FaHeart className="dark:text-rose-700 text-rose-400" /> 
                                                    ) : (
                                                        <FaRegHeart />
                                                    )}
                                                    {studySet.favoritedBy.length}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) }
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="favorites">
                        <Card
                            className="w-full h-full relative border-1 
                            dark:border-indigo-200 border-indigo-900
                            dark:bg-slate-950 bg-indigo-200"
                        >
                            <CardHeader>
                                <CardTitle>
                                    My Favorites
                                </CardTitle>
                                <CardDescription>
                                    Collection of my favorited study sets
                                </CardDescription>
                            </CardHeader>
                            <CardContent
                                className={`${!accountUser?.favorites || accountUser?.favorites.length === 0 ? "flex justify-center" : "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1" } gap-2 relative`}
                            >
                                { loading && <LoadingOverlay className="md:my-24 my-12" /> }   
                                { !accountUser?.favorites || accountUser?.favorites.length === 0 && 
                                    <p className="text-md dark:text-gray-300 text-gray-700 text-center md:my-24 my-12">
                                        No favorites. Find some study sets from the 'Explore' tab!
                                    </p>
                                }
                                { !loading && accountUser?.favorites.map((studySet) => (
                                    <Card
                                        key={studySet.id}
                                        className="cursor-pointer border-none relative
                                        dark:bg-slate-900 bg-[rgba(255,255,255,0.4)]
                                        hover:dark:bg-slate-800 hover:bg-blue-200 duration-150"
                                        onClick={() => navigate(`/study-set/${studySet.id}`)}
                                    >
                                        { singleLoading === studySet.id && <LoadingOverlay /> }
                                        <CardHeader className="gap-1">
                                            <CardTitle className="font-bold dark:text-indigo-100 text-slate-950 text-nowrap">
                                            {studySet.name}
                                            </CardTitle>
                                            <CardDescription
                                            className="dark:text-indigo-300 text-slate-900 flex flex-col gap-1"
                                            >
                                            <p>
                                                {studySet.deck.cards.length} flashcards 
                                                • {studySet.quiz.attempts.length} quiz attempts
                                            </p>
                                            <div className="flex gap-2">
                                                <p className={`w-fit px-2 rounded-xl text-xs
                                                ${studySet.public ? "dark:bg-indigo-300 bg-indigo-300" : "dark:bg-slate-950 bg-indigo-900" }
                                                ${studySet.public ? "dark:text-indigo-900 text-indigo-950" : "dark:text-indigo-200 text-indigo-200" }`}
                                                >
                                                {studySet.public ? "Public " : "Private "}
                                                </p>
                                                <p className={`w-fit px-2 rounded-xl text-xs
                                                ${studySet.difficulty === "BEGINNER" && "dark:bg-green-900 bg-green-300 dark:text-white text-black" }
                                                ${studySet.difficulty === "INTERMEDIATE" && "dark:bg-yellow-700 bg-yellow-500 dark:text-white text-black" }}
                                                ${studySet.difficulty === "ADVANCED" && "dark:bg-red-900 bg-red-300 dark:text-white text-black"}`}
                                                >
                                                {studySet.difficulty.charAt(0) + studySet.difficulty.slice(1).toLowerCase()}
                                                </p>
                                            </div>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex justify-between">
                                            <div 
                                                className="flex gap-1 items-center justify-start text-sm font-semibold rounded-lg p-1 pr-2 
                                                hover:dark:bg-slate-700 hover:bg-blue-300 duration-150"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/profile/${studySet.userId}`);
                                                }}
                                            >
                                                <Avatar className="size-6 rounded-2xl">
                                                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                                                    <AvatarFallback>Icon</AvatarFallback>
                                                </Avatar>
                                                <p className="truncate">
                                                    { studySet.user.displayName }
                                                </p>
                                            </div>
                                            <p 
                                                className="flex items-center gap-1 text-sm font-semibold py-1 px-2 rounded-lg
                                                dark:text-indigo-100 text-indigo-950
                                                hover:dark:bg-rose-500 hover:bg-rose-300 duration-150"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnfavorite(studySet);
                                                }}
                                            >
                                            <FaHeart 
                                                className="dark:text-rose-700 text-rose-400" /> 
                                                {studySet.favoritedBy.length}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )) }
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
} 