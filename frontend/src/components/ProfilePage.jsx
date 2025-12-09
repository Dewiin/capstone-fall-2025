import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate, useParams } from "react-router-dom";
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
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number";
import { toast } from "sonner";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function ProfilePage() {
    const { user, authLoading } = useAuth();

    // backend
    const [ accountUser, setAccountUser ] = useState(null);
    const [ accountFollowers, setAccountFollowers ] = useState([]);
    const [ accountFollowing, setAccountFollowing ] = useState([]);
    const [ flashcardCount, setFlashcardCount ] = useState(0);
    const [ attemptCount, setAttemptCount ] = useState(0);
    const [ createdAt, setCreatedAt ] = useState(null);
    
    // frontend
    const [ loading, setLoading ] = useState(false);
    const [ singleLoading, setSingleLoading ] = useState(null);
    const [ followLoading, setFollowLoading ] = useState(false);
    const [ accountTab, setAccountTab ] = useState("studySets");
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        if(!authLoading) { 
            if(!user) {
                navigate("/unauthorized");
            } else {
                if(user?.id === userId) {
                    navigate("/account");
                } else {
                    getProfile();
                }
            }
        }
    }, [authLoading, userId]);

    async function getProfile() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/profile/${userId}`, {
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
                            ? [...s.favoritedBy, user] 
                            : s.favoritedBy.filter(u => u.id !== user.id)
                        }
                        : s
                    )),
                    favorites: prev.favorites.map((f) => (
                        f.id === studySet.id
                        ? {
                            ...f,
                            favoritedBy: !alreadyFavorited
                            ? [...f.favoritedBy, user]
                            : f.favoritedBy.filter(u => u.id !== user.id)
                        }
                        : f
                    ))
                }))
                {
                    result.favorited && toast.error("Removed from favorites!", {
                        description: (
                        <>
                            Successfully unfavorited <i>{studySet.name}</i>
                        </>
                        ),
                    });
                }
                {
                    !result.favorited && toast.success("Added to favorites!", {
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

    async function handleFollow() {
        setFollowLoading(true);

        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/profile/follow/${userId}`, {
                method: "POST",
                credentials: "include"
            });
            if(!response.ok) {
                toast.warning("There was an error getting a response", {
                    description: "Please try again later."
                });
                console.error(`Error getting a response for the follow request: `, response.status);
                return;
            }

            const result = await response.json();
            if(result.status === 1) {
                if(result.action === "follow") {
                    setAccountUser((prev) => ({
                        ...prev,
                        followers: [
                            ...prev.followers,
                            result.userFollow,
                        ]
                    }));
                    setAccountFollowers((prev) => ([
                        ...prev,
                        result.userFollow,
                    ]));
                    toast.success("Successful follow!", {
                        description: 
                        <>
                            You followed <i>{accountUser.displayName}</i>
                        </>
                    });
                } else {
                    setAccountUser((prev) => ({
                        ...prev,
                        followers: prev.followers.filter((u) => u.followerId !== user.id)
                    }));
                    setAccountFollowers((prev) => (
                        prev.filter((u) => u.followerId !== user.id)
                    ));
                    toast.error("Successful unfollow!", {
                        description: 
                        <>
                            You unfollowed <i>{accountUser.displayName}</i>
                        </>
                    });
                }
            } else {
                toast.warning("There was an error!", {
                    description: "Please try again later."
                });
            }
        } catch (err) {
            toast.warning("There was an error!", {
                description: "Please try again later."
            });
            console.error(`Error handling the follow request: `, err);
            return;
        } finally {
            setFollowLoading(false);
        }
    }

    async function handleFollowSearch(val, tab) {
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/profile/${userId}/search/${tab}?search_query=${val}`, {
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
        <div className="flex flex-col md:mx-24 md:mt-24 mx-8 mt-8 mb-0 gap-2 min-h-screen">
            <div className="flex flex-col gap-2 h-fit">
                {/* First Section */}
                <section className='flex md:flex-row flex-col md:gap-8 gap-4 p-4 rounded-lg md:h-30 w-full select-none
                    bg-indigo-200 dark:bg-slate-950 
                    border-1 border-indigo-900 dark:border-indigo-300'
                >
                    {/* Avatar/Name */}
                    <div className="flex gap-4 items-center md:max-w-1/3 text-indigo-900 dark:text-indigo-200">
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
                                    {accountUser?.displayName}
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
                                study sets
                            </p>
                            <CountingNumber 
                                number={ accountUser ? accountUser.studySets.length : 0 }
                                className="md:text-4xl text-2xl font-semibold"
                                />
                        </span>
                        <span>
                            <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                flash cards
                            </p>
                            <CountingNumber 
                                number={ flashcardCount }
                                className="md:text-4xl text-2xl font-semibold"
                                />
                        </span>
                        <span>
                            <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                quiz attempts
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
                                            <i>{accountUser?.displayName}</i> currently has no followers.
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
                                                <HoverCard
                                                    openDelay={150}
                                                    closeDelay={100}
                                                >
                                                    <HoverCardTrigger asChild>
                                                        <div className="flex items-center gap-2 select-none">
                                                            <Avatar className="size-9 rounded-2xl border-1">
                                                                <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                                                                <AvatarFallback>Icon</AvatarFallback>
                                                            </Avatar>
                                                            {f.follower.displayName}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent
                                                        className="w-md"
                                                        side="left"
                                                    >
                                                        <section className='flex md:flex-row flex-col p-2 pl-6 rounded-lg md:h-20 select-none
                                                           bg-indigo-200 dark:bg-slate-950'
                                                        > 
                                                            {/* Personal Stats */}
                                                            <div className=" flex-1 grid md:grid-cols-3 grid-cols-2 md:gap-0 gap-4 items-center text-indigo-900 dark:text-indigo-100">
                                                                <span>
                                                                    <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                                                        study sets
                                                                    </p>
                                                                    <CountingNumber 
                                                                        number={ f.follower.studySets.length }
                                                                        className="md:text-4xl text-2xl font-semibold"
                                                                    />
                                                                </span>
                                                                <span>
                                                                    <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                                                        quiz attempts
                                                                    </p>
                                                                    <CountingNumber 
                                                                        number={ f.follower.attempts.length }
                                                                        className="md:text-4xl text-2xl font-semibold"
                                                                        />
                                                                </span>
                                                                <span>
                                                                    <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                                                        favorites added
                                                                    </p>
                                                                    <CountingNumber 
                                                                        number={ f.follower.favorites.length }
                                                                        className="md:text-4xl text-2xl font-semibold"
                                                                        />
                                                                </span>
                                                            </div>
                                                        </section>  
                                                    </HoverCardContent>
                                                </HoverCard>
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
                                                <HoverCard
                                                    openDelay={150}
                                                    closeDelay={100}
                                                >
                                                    <HoverCardTrigger asChild>
                                                        <div className="flex items-center gap-2 select-none">
                                                            <Avatar className="size-9 rounded-2xl border-1">
                                                                <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                                                                <AvatarFallback>Icon</AvatarFallback>
                                                            </Avatar>
                                                            {f.following.displayName}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent
                                                        className="w-md"
                                                        side="left"
                                                    >
                                                        <section className='flex md:flex-row flex-col p-2 pl-6 rounded-lg md:h-20 select-none
                                                           bg-indigo-200 dark:bg-slate-950'
                                                        > 
                                                            {/* Personal Stats */}
                                                            <div className=" flex-1 grid md:grid-cols-3 grid-cols-2 md:gap-0 gap-4 items-center text-indigo-900 dark:text-indigo-100">
                                                                <span>
                                                                    <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                                                        study sets
                                                                    </p>
                                                                    <CountingNumber 
                                                                        number={ f.following.studySets.length }
                                                                        className="md:text-4xl text-2xl font-semibold"
                                                                    />
                                                                </span>
                                                                <span>
                                                                    <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                                                        quiz attempts
                                                                    </p>
                                                                    <CountingNumber 
                                                                        number={ f.following.attempts.length }
                                                                        className="md:text-4xl text-2xl font-semibold"
                                                                        />
                                                                </span>
                                                                <span>
                                                                    <p className="text-sm dark:text-indigo-300 text-indigo-900 font-semibold">
                                                                        favorites added
                                                                    </p>
                                                                    <CountingNumber 
                                                                        number={ f.following.favorites.length }
                                                                        className="md:text-4xl text-2xl font-semibold"
                                                                        />
                                                                </span>
                                                            </div>
                                                        </section>  
                                                    </HoverCardContent>
                                                </HoverCard>
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
                        <div>
                            <button
                                className={`py-1 rounded-lg font-semibold w-full
                                ${accountUser?.followers.some((u) => u.followerId === user.id) ? 
                                `text-zinc-900 hover:text-zinc-300
                                dark:bg-zinc-200 bg-zinc-300
                                hover:dark:bg-slate-900 hover:bg-slate-700
                                active:dark:bg-zinc-700 active:bg-zinc-400
                                ` 
                                : 
                                `text-zinc-300 hover:text-zinc-900 
                                dark:bg-slate-900 bg-slate-700
                                hover:dark:bg-zinc-300 hover:bg-zinc-200
                                active:dark:bg-zinc-700 active:bg-zinc-400
                                ` } 
                                text-sm
                                duration-150`}
                                onClick={() => handleFollow()}
                            >
                                { followLoading && <LoadingOverlay /> }
                                { accountUser?.followers.some((u) => u.followerId === user.id) ? "unfollow" : "follow" }
                            </button>
                        </div>
                    </section>
            </div>

            {/* Second Section */}
            <section className="flex-1 flex mt-12">
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
                                { loading && 
                                <>
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </>
                                }
                                { !loading && 
                                <>
                                    <CardTitle>
                                        {accountUser?.displayName}'s Study Sets
                                    </CardTitle>
                                    <CardDescription>
                                        Collection of <i>{accountUser?.displayName}'s</i> study sets
                                    </CardDescription>
                                </>
                                }
                            </CardHeader>
                            <CardContent
                                className={`${!accountUser?.studySets || accountUser?.studySets.length === 0 ? "flex justify-center" : "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1" } gap-2 relative`}
                            >
                                { loading && <LoadingOverlay className="md:my-24 my-12" /> }
                                { !accountUser?.studySets || accountUser?.studySets.length === 0 && 
                                    <p className="text-md dark:text-gray-300 text-gray-700 text-center md:my-24 my-12">
                                        <i>{accountUser?.displayName}</i> has no public study sets.
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
                                        <CardContent>
                                            <p 
                                            className="flex justify-start w-fit items-center gap-1 text-sm font-semibold p-2 rounded-lg 
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
                                { loading &&
                                <>
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[250px]" />
                                </>
                                }
                                {!loading && 
                                <>
                                    <CardTitle>
                                        {accountUser?.displayName}'s Favorites
                                    </CardTitle>
                                    <CardDescription>
                                        Collection of <i>{accountUser?.displayName}'s</i> favorited study sets
                                    </CardDescription>
                                </>
                                }
                            </CardHeader>
                            <CardContent
                                className={`${!accountUser?.favorites || accountUser?.favorites.length === 0 ? "flex justify-center" : "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1" } gap-2 relative`}
                            >
                                { loading && <LoadingOverlay className="md:my-24 my-12" /> }   
                                { !accountUser?.favorites || accountUser?.favorites.length === 0 && 
                                    <p className="text-md dark:text-gray-300 text-gray-700 text-center md:my-24 my-12">
                                        <i>{accountUser?.displayName}</i> has no public favorites.
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
                                            <CardTitle className="font-bold dark:text-indigo-100 text-slate-950">
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