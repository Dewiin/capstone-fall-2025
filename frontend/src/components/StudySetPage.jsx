import { LoadingOverlay } from "./LoadingOverlay";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { 
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent, 
} from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function StudySetPage() {
    const { user } = useAuth();
    const [ notesType, setNotesType ] = useState("deck");
    const [ loading, setLoading ] = useState(false);
    const { studySetId } = useParams();
    const navigate = useNavigate();

    // notes
    const [ quiz, setQuiz ] = useState({questions: [{}]});
    const [ deck, setDeck ] = useState({cards: []});
    const [ studySet, setStudySet ] = useState({});

    // carousel state
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [flipped, setFlipped] = useState({});
    

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        async function fetchStudySet() {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL_DOMAIN}/api/study-set/${studySetId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if(!response.ok) {
                    console.error(`Error getting a response for study set: `, response.status);
                    return;
                }

                const result = await response.json();
                if(result.status == 1) {
                    // console.log(result.deck.cards);
                    // console.log(result.quiz.questions);
                    setStudySet(result.studySet);
                    setDeck(result.deck);
                    setQuiz(result.quiz);
                } else {
                    console.error('Study Set not found');
                }
            } catch (err) {
                console.error(`Error fetching study set: `, err);
            } finally {
                setLoading(false);
            }
        }

        fetchStudySet();
    }, []);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        });
    }, [api, current, count])

    return (
        <>  
            <div className="p-24 h-full">
                <Breadcrumb className="p-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="select-none"
                                onClick={() => navigate(`/account/${user.id}`)}
                            >
                                {user?.displayName}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage> {studySet.name} </BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                { notesType === "deck" ? ("Deck") : ("Quiz") } 
                            </BreadcrumbPage> 
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Tabs
                    defaultValue={notesType}
                    className="flex gap-6"
                    onValueChange={(val) => {
                        setNotesType(val);
                    }}
                >
                    <TabsList className="m-auto">
                        <TabsTrigger value="deck"> Deck </TabsTrigger>    
                        <TabsTrigger value="quiz"> Quiz </TabsTrigger>    
                    </TabsList>
                    <TabsContent 
                        value="deck"
                        className="flex flex-col justify-center items-center gap-2 relative"
                    >
                        { loading && <LoadingOverlay /> }

                        <Carousel
                            setApi={setApi}
                            className="w-full max-w-2xl"
                        >
                            <CarouselContent>
                                { deck.cards.map((card) => (
                                    <>
                                        <CarouselItem key={card.id}>
                                            <div className="relative">
                                                <Card onClick={() => setFlipped((prev) => {
                                                    return {
                                                        ...prev,
                                                        [card.id]: !prev[card.id],
                                                    }
                                                })}>
                                                    <CardContent className={`flex aspect-video ${!flipped[card.id] && "items-center"} justify-center p-24`}>
                                                        { flipped[card.id] ? (
                                                            <div className="w-full flex flex-col gap-6">
                                                                <span className="text-sm text-gray-500">
                                                                    {card.question}
                                                                </span>
                                                                <span className="text-2xl font-semibold">
                                                                    {card.answer}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-2xl font-semibold">
                                                                {card.question}
                                                            </span>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    </>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <p> {current} / {count > 0 ? count : deck.cards.length} </p>
                        <Progress 
                            className="max-w-2xl mb-20"
                            value={ count > 0 ? (100/count) * (current) : (100/deck.cards.length) * current }
                        />

                        { deck.cards.map((card) => (
                            <Card 
                                key={card.id}
                                className="md:w-3xl w-sm h-50"
                            >
                                <CardContent className="flex items-center justify-between text-sm h-full">
                                    <p className="w-xs"> { card.question } </p>
                                    <Separator orientation="vertical" />
                                    <p className="w-xs"> { card.answer } </p>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                    <TabsContent value="quiz">

                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}