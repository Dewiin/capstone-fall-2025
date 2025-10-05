import { LoadingOverlay } from "./LoadingOverlay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import { useEffect, useState, useRef } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate, useParams } from "react-router-dom";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function StudySetPage() {
    const { user } = useAuth();
    const [ notesType, setNotesType ] = useState("deck");
    const [ loading, setLoading ] = useState(false);
    const { studySetId } = useParams();
    const smoothScroll = useRef(null);
    const navigate = useNavigate();

    // notes
    const [ quiz, setQuiz ] = useState({questions: []});
    const [ deck, setDeck ] = useState({cards: []});
    const [ studySet, setStudySet ] = useState({});

    // carousel state
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [flipped, setFlipped] = useState({});
    const [selected, setSelected] = useState({});
    const [correct, setCorrect] = useState({});
    const [submitted, setSubmitted] = useState(false);
    

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
                    console.log(result.quiz);

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
    }, [api, current, count]);

    async function handleSubmit() {
        setLoading(true);
        try {

        } catch (err) {
            console.error(`Error handling quiz submission: `, err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>  
            <div 
                className="md:p-24 p-8 h-full min-w-sm"
                ref={smoothScroll}
            >
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
                    className="flex gap-12"
                    onValueChange={(val) => {
                        setNotesType(val);
                    }}
                >
                    <TabsList className="m-auto">
                        <TabsTrigger value="deck"> Deck </TabsTrigger>    
                        <TabsTrigger value="quiz"> Quiz </TabsTrigger>    
                        <TabsTrigger value="progress"> Progress </TabsTrigger>    
                    </TabsList>
                    <TabsContent 
                        value="deck"
                        className="flex flex-col justify-center items-center gap-2 relative"
                    >
                        { loading && <LoadingOverlay /> }

                        { !loading && 
                        <>
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
                        </>
                        }

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
                    <TabsContent 
                        value="quiz"
                        className="flex flex-col justify-center items-center gap-2 relative"
                    >
                        { loading && <LoadingOverlay /> }

                        <Carousel
                            orientation="vertical"
                            className="w-full max-w-2xl"
                        >
                            <CarouselContent>
                                {quiz.questions.map((question, index) => (
                                    <CarouselItem 
                                        key={question.id}
                                    >
                                        <Card
                                            className="flex aspect-video p-12 justify-between relative"
                                        >
                                            <p className="absolute top-5 right-5 text-gray-500">
                                                {index+1} of {quiz.questions.length}
                                            </p>
                                            <CardContent>
                                                {question.question}
                                            </CardContent>
                                            <div className="grid sm:grid-cols-2 grid-cols-1 h-1/1.5 gap-6 p-6">
                                                {Object.entries(question.choices).map(([key, value]) => (
                                                    <Card 
                                                        key={key}
                                                        className={
                                                            `md:text-sm text-xs 
                                                            ${key == selected[question.id] &&
                                                            (submitted ?
                                                            (
                                                                correct[question.id] ? "bg-green-600 border-green-800" : "border-red-600 bg-red-800"
                                                            ) : (
                                                                "border-cyan-800"
                                                            ))} 
                                                            ${submitted && key == question.correctAnswer && "bg-transparent border-green-800"}
                                                            border-2 select-none`
                                                        }
                                                        onClick={() => {
                                                            if(submitted) return;
                                                            setSelected((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    [question.id]: key,
                                                                }
                                                            })
                                                            setCorrect((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    [question.id]: key == question.correctAnswer
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <b>{key.toUpperCase()}.</b> &nbsp;{value}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <Button 
                                className="block m-auto mt-5"
                                onClick={() => {
                                    smoothScroll.current.scrollIntoView({behavior: "smooth"});
                                    if(!submitted) {
                                        setSubmitted(true);
                                    } else {
                                        setSubmitted(false);
                                        setCorrect([]);
                                        setSelected([]);
                                    }
                                }}
                            >
                                {submitted ? "Retry" : "Submit"}
                            </Button>
                        </Carousel>
                    </TabsContent>
                    <TabsContent
                        value="progress"
                    >
                        { loading && <LoadingOverlay /> }
                        Chart goes here
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}