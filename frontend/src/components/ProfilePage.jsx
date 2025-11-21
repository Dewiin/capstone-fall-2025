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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CountingNumber } from "@/components/ui/shadcn-io/counting-number";
import { toast } from "sonner";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function ProfilePage() {
    const { user, authLoading } = useAuth();

    // backend
    const [ accountUser, setAccountUser ] = useState(null);
    const [ flashcardCount, setFlashcardCount ] = useState(0);
    const [ attemptCount, setAttemptCount ] = useState(0);
    const [ createdAt, setCreatedAt ] = useState(null);
    
    // frontend
    const [ loading, setLoading ] = useState(false);
    const [ singleLoading, setSingleLoading ] = useState(null);
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
    }, [authLoading]);

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
        
        try {

        } catch {

        } finally {
            
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
                    className='p-4 rounded-lg h-full w-3xs select-none flex flex-col gap-4
                    bg-indigo-200 dark:bg-slate-950 
                    border-1 border-indigo-900 dark:border-indigo-300'
                    >
                    <div
                        className="flex justify-evenly
                        dark:text-indigo-300 text-indigo-900 text-sm font-semibold"
                        >
                        <p>
                            <CountingNumber 
                                number={ accountUser ? accountUser.followers.length : 0 }
                            /> 
                            &nbsp;followers
                        </p>
                        <p>
                            <CountingNumber 
                                number={ accountUser ? accountUser.following.length : 0 }
                            />
                            &nbsp;following
                        </p>
                    </div>
                    <div>
                        <button
                            className="py-1 rounded-lg font-semibold w-full
                            text-zinc-300 hover:text-zinc-900 text-sm
                            dark:bg-slate-900 bg-slate-700
                            hover:dark:bg-zinc-300 hover:bg-zinc-200
                            active:dark:bg-zinc-700 active:bg-zinc-400
                            duration-150"
                            onClick={() => handleFollow()}
                            >
                            follow
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