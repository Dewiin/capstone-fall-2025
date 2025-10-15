import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate } from "react-router-dom";
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
import { MdDeleteOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";


const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function AccountPage() {
    const { user } = useAuth();

    // backend
    const [ studySets, setStudySets ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ flashcardCount, setFlashcardCount ] = useState("...");
    const [ attemptCount, setAttemptCount ] = useState("...");
    const [ createdAt, setCreatedAt ] = useState(null);
    const [ favorites, setFavorites ] = useState(null);

    const [ accountTab, setAccountTab ] = useState("studySets");
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        getAccount();
    }, []);

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
                setStudySets(result.userStudySets);
                setFlashcardCount(result.flashcardCount);
                setAttemptCount(result.attemptCount);
                setCreatedAt(result.createdAt);
                setFavorites(result.userFavorites);
            }
        } catch (err) {
            console.error(`Error getting account info: `, err);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleDelete(studySetId) {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/study-set/${studySetId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if(!response.ok) {
                console.error(`Error getting response for deleting study set: `, response.status);
                return;
            }

            const result = await response.json();
            if(result.status == 1) {
                setStudySets(prev => prev.filter(s => s.id !== studySetId));
                getAccount();
            }
            else {
                console.error("Could not find study set to delete");
            }
        } catch (err) {
            console.error(`Error deleting study set: `, err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:mx-24 md:mt-24 mx-8 mt-8 mb-0 md:gap-16 gap-8 min-h-screen">
            {/* First Section */}
            <section className='flex md:flex-row flex-col gap-8 p-4 rounded-lg md:h-30 select-none
                bg-indigo-200 dark:bg-indigo-950 
                border-1 border-indigo-900
                dark:border-indigo-300'>
                {/* Avatar/Name */}
                <div className="flex gap-4 items-center pr-8 md:max-w-1/4 text-indigo-900 dark:text-indigo-200">
                    <Avatar className="size-20 rounded-2xl">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                        <AvatarFallback>Icon</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 truncate">
                        <p className="text-3xl font-semibold truncate">
                            {user?.displayName}
                        </p>
                        <p className="text-xs">
                            Joined {createdAt ? createdAt : "..."}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <Separator orientation="vertical" className="hidden md:block border-3 rounded-xl border-indigo-300" />

                {/* Personal Stats */}
                <div className=" flex-1 grid md:grid-cols-3 grid-cols-1 md:gap-0 gap-4 items-center text-indigo-900 dark:text-indigo-100">
                    <span>
                        <p className="text-sm dark:text-indigo-300 text-indigo-900">
                            study sets created
                        </p>
                        <p className="text-4xl font-semibold">
                            { studySets ? studySets.length : "..." }
                        </p>
                    </span>
                    <span>
                        <p className="text-sm dark:text-indigo-300 text-indigo-900">
                            flash cards created
                        </p>
                        <p className="text-4xl font-semibold">
                            { flashcardCount }
                        </p>
                    </span>
                    <span>
                        <p className="text-sm dark:text-indigo-300 text-indigo-900">
                            quiz attempts recorded
                        </p>
                        <p className="text-4xl font-semibold">
                            { attemptCount }
                        </p>
                    </span>
                </div>
            </section>

            {/* Second Section */}
            <section className="flex-1 flex">
                <Tabs 
                    defaultValue={accountTab}
                    onValueChange={(val) => setAccountTab(val)}
                    className="flex-1"
                >
                    <TabsList
                        className="dark:bg-indigo-950 bg-indigo-200 border-1 dark:border-indigo-200 border-indigo-900 mb-4"
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
                                dark:bg-indigo-950 bg-indigo-200"
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
                                className={`${!studySets || studySets.length === 0 ? "flex justify-center" : "grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1" } gap-2 relative`}
                            >
                                { loading && <LoadingOverlay className="md:my-24 my-12" /> }
                                { !studySets || studySets.length === 0 && 
                                    <p className="text-md dark:text-gray-300 text-gray-700 text-center md:my-24 my-12">
                                        No study sets. Create one from the 'Generate' tab!
                                    </p>
                                }
                                { studySets?.map((studySet) => (
                                    <Card
                                        className="dark:bg-indigo-400 bg-indigo-100 border-1 border-indigo-700 dark:border-indigo-200 cursor-pointer"
                                        onClick={() => navigate(`/study-set/${studySet.id}`)}
                                    >
                                        <CardHeader className="gap-1">
                                            <CardTitle className="font-bold dark:text-indigo-100 text-indigo-950">
                                                {studySet.name}
                                            </CardTitle>
                                            <CardDescription
                                                className="text-indigo-900 flex flex-col gap-1"
                                            >
                                                <p>
                                                    {studySet.deck.cards.length} flashcards 
                                                    • {studySet.quiz.attempts.length} quiz attempts
                                                </p>
                                                <p className="w-fit px-2 rounded-xl text-xs
                                                    dark:bg-indigo-200 bg-indigo-900
                                                    dark:text-indigo-900 text-indigo-200"
                                                >
                                                    {studySet.public ? "Public " : "Private "}
                                                </p>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-2 items-center">
                                            <MdDeleteOutline 
                                                className="justify-start z-9999" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDelete(studySet.id);
                                                }}    
                                            />
                                            <p className="flex justify-end items-center gap-1 text-sm font-semibold dark:text-indigo-100 text-indigo-950">
                                                {studySet.favoritedBy.length}
                                                <FaHeart /> 
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
                            dark:bg-indigo-950 bg-indigo-200"
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
                                className="relative"
                            >
                                { loading && <LoadingOverlay className="md:my-24 my-12" /> }   
                                { !favorites || favorites.length === 0 && 
                                    <p className="text-md dark:text-gray-300 text-gray-700 text-center md:my-24 my-12">
                                        No favorites. Find some study sets from the 'Explore' tab!
                                    </p>
                                }
                                {  }
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