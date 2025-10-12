import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "./LoadingOverlay";
import {
    Card, 
    CardHeader,
    CardContent,
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
import { Separator } from "@/components/ui/separator";


const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function AccountPage() {
    const { user } = useAuth();
    const [ studySets, setStudySets ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ flashcardCount, setFlashcardCount ] = useState("...");
    const [ attemptCount, setAttemptCount ] = useState("...");
    const [ createdAt, setCreatedAt ] = useState(null);
    const [ accountTab, setAccountTab ] = useState("studySets");
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
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
                }
            } catch (err) {
                console.error(`Error getting account info: `, err);
            }
            finally {
                setLoading(false);
            }
        }

        getAccount();
    }, []);

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
        <div className="flex flex-col md:m-24 m-8 gap-32">
            {/* First Section */}
            <section className='flex md:flex-row flex-col gap-8 p-4 rounded-lg bg-indigo-200 dark:bg-indigo-900 md:h-30 select-none'>
                {/* Avatar/Name */}
                <div className="flex gap-4 items-center pr-8 max-w-1/4">
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
                <Separator orientation="vertical" className="hidden md:block border-3 rounded-xl" />

                {/* Personal Stats */}
                <div className=" flex-1 grid md:grid-cols-3 grid-cols-1 gap-2 items-center">
                    <span>
                        <p className="text-sm">
                            study sets created
                        </p>
                        <p className="text-4xl font-semibold">
                            { studySets ? studySets.length : "..." }
                        </p>
                    </span>
                    <span>
                        <p className="text-sm">
                            flash cards created
                        </p>
                        <p className="text-4xl font-semibold">
                            { flashcardCount }
                        </p>
                    </span>
                    <span>
                        <p className="text-sm">
                            quiz attempts recorded
                        </p>
                        <p className="text-4xl font-semibold">
                            { attemptCount }
                        </p>
                    </span>
                </div>
            </section>

            {/* Second Section */}
            <section>
                <Tabs 
                    defaultValue={accountTab}
                    onValueChange={(val) => setAccountTab(val)}
                >
                    <TabsList>
                        <TabsTrigger value="studySets">Study Sets</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    </TabsList>
                    <TabsContent value="studySets">
                        { loading && <LoadingOverlay /> }

                    </TabsContent>
                    <TabsContent value="favorites">
                        { loading && <LoadingOverlay /> }

                    </TabsContent>
                </Tabs>
            </section>
            <div className="flex flex-col justify-center items-center align-center gap-12 relative">
                { loading && <LoadingOverlay /> }
                { !loading &&
                <>
                    <p className="text-2xl font-semibold">My Study Sets</p>
                    <div className="flex flex-wrap justify-center gap-4 h-full w-full">
                        {!studySets || studySets.length === 0 && 
                            <p className="2xl dark:text-gray-300">
                                No study sets. Create one in the 'Generate' tab!
                            </p>
                        }
                        {studySets?.map((studySet) => (
                            <Card 
                                key={ studySet.id }
                                className="w-full max-w-xs h-35 select-none" 
                                onClick={() => navigate(`/study-set/${studySet.id}`)}
                            >
                                <CardHeader className="relative">
                                    <p className="text-sm absolute top-0 left-5">
                                        { studySet.public ? "Public" : "Private" }
                                    </p>
                                    <MdDeleteOutline 
                                        className="absolute top-1 right-5 text-red-400 text-md cursor-pointer" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete( studySet.id )
                                        }}
                                    />
                                </CardHeader>
                                <CardContent className="flex  justify-center h-full">
                                    <p className="text-3xl">
                                        { studySet.name }
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
                }           
            </div>
        </div>
    );
} 