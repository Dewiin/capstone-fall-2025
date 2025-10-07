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

// chart
import { 
    Label, 
    Pie, 
    PieChart,
    CartesianGrid,
    Line,
    LineChart,
    XAxis, 
    ResponsiveContainer,
    YAxis,
    Tooltip
} from "recharts"

// react
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
    const [ api, setApi ] = useState(null);
    const [ current, setCurrent ] = useState(0);
    const [ count, setCount ] = useState(0);
    const [ flipped, setFlipped ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ correct, setCorrect ] = useState({});
    const [ submitted, setSubmitted ] = useState(false);
    const [ score, setScore ] = useState(0);
    
    // chart
    const [ chartData, setChartData ] = useState([]);
    const [ progressData, setProgressData ] = useState([]);

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
                    const allAttempts = result.quiz.attempts.map((attempt, index) => ({
                        attempt: index + 1,
                        score: attempt.score,
                    }));
                    setProgressData(allAttempts);

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

    useEffect(() => {
        if (quiz?.questions?.length > 0) {
            setChartData([
                { status: "correct", count: score, fill: "rgba(5, 150, 105, 1)" },
                { status: "incorrect", count: quiz.questions.length - score, fill: "rgba(185, 28, 28, 1)" }
            ]);
        }

        if (quiz?.attempts?.length > 0) {
            const allAttempts = quiz.attempts.map((attempt, index) => ({
                attempt: index + 1,
                score: attempt.score,
            }));
            setProgressData(allAttempts);
        }
    }, [score, quiz, submitted]);

    useEffect(() => {
        if (smoothScroll.current) {
            smoothScroll.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [submitted]);

    async function handleSubmit(score) {
        setLoading(true);
        if(!submitted) {
            setSubmitted(true);
        } else {
            setSubmitted(false);
            setScore(0);
            setCorrect({});
            setSelected({});
        }

        try {
            // update database (attempts & highScore)
            try {
                const response = await fetch(`${API_URL_DOMAIN}/api/study-set/${studySetId}`, {
                    method: "PUT",
                    body: JSON.stringify({ 
                        score,
                    }),
                    credentials: "include",
                    headers: {"Content-Type": "application/json"}
                })
                if(!response.ok) {
                    console.error(`Error getting a response for updating quiz: `, response.status);
                    return;
                }

                const result = await response.json();
                if(result.status == 1) {
                    setQuiz(result.quiz);
                } else {
                    console.error(`Quiz not found`);
                }
            } catch (err) {
                console.error(`Error updating quiz score: `, err);
            } 
        } catch (err) {
            console.error(`Error handling quiz submission: `, err);
        } finally {
            setLoading(false);
        }
    }

    // Custom tooltip component
    function CustomTooltip({ active, payload, label }) {
        if (!active || !payload || payload.length === 0) return null;

        const data = payload[0];

        return (
            <div className="flex dark:bg-black bg-white gap-4 shadow-lg rounded-lg border px-2 py-1 border-gray-200 text-xs">
                <p className="dark:text-gray-300 text-gray-700">Attempt {label}</p>
                <p className="dark:text-white font-semibold">{data.value} {data.value == 1 ? "pt" : "pts"}</p>
            </div>
        );
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
                    {/* ------------------------------------------------------- DECK ------------------------------------------------------- */}
                    <TabsContent 
                        value="deck"
                        className="flex flex-col justify-center items-center gap-2 relative"
                    >
                        { loading && <LoadingOverlay /> }

                        { !loading && 
                        <>
                            <Carousel
                                setApi={setApi}
                                className="w-full md:w-2xl md:aspect-video w-2xs mb-5"
                            >
                                <CarouselContent>
                                    { deck.cards.map((card) => (
                                        <>
                                            <CarouselItem key={card.id}>
                                                <div>
                                                    <Card 
                                                        onClick={() => setFlipped((prev) => {
                                                            return {
                                                                ...prev,
                                                                [card.id]: !prev[card.id],
                                                            }
                                                        })}
                                                    >
                                                        <CardContent className={`flex aspect-video ${!flipped[card.id] && "items-center"} justify-center md:px-24 md:p-20 px-8 h-fit`}>
                                                            { flipped[card.id] ? (
                                                                <div className="w-full flex flex-col gap-6 overflow-scroll">
                                                                    <span className="md:text-sm text-xs text-gray-500">
                                                                        {card.question}
                                                                    </span>
                                                                    <span className="md:text-2xl text-sm font-semibold">
                                                                        {card.answer}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="md:text-2xl font-semibold">
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
                                className="max-w-2xl mb-10"
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
                            </>
                        }
                    </TabsContent>
                    {/* ------------------------------------------------------- QUIZ ------------------------------------------------------- */}
                    <TabsContent 
                        value="quiz"
                        className="flex flex-col justify-center items-center gap-2 relative"
                    >
                        { loading && <LoadingOverlay /> }
                        { submitted && !loading && 
                            <Card className="md:items-start bg-transparent items-center md:w-2xl w-sm mb-5 border-none md:p-6 p-12">
                                <CardContent className="flex flex-wrap md:gap-12 gap-2 justify-center items-center">
                                    <div
                                        className="aspect-square mx-10"
                                    >
                                        <PieChart width={200} height={200}>
                                            <Pie
                                                key={Math.random() + score}
                                                data={chartData}
                                                dataKey="count"
                                                nameKey="status"
                                                innerRadius={70}
                                                outerRadius={80}
                                                stroke="none"
                                                isAnimationActive={true}
                                                animationBegin={1000}
                                                animationDuration={2000}
                                                animationEasing="ease"
                                            >
                                                <Label
                                                    content={({ viewBox }) => {
                                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                            const scorePercentage = quiz?.questions?.length 
                                                            ? Math.round((score / quiz.questions.length) * 100) : 0;
                                                            return (
                                                            <text
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                <tspan
                                                                    x={viewBox.cx}
                                                                    y={viewBox.cy}
                                                                    className="fill-foreground text-3xl font-bold"
                                                                    >
                                                                    {scorePercentage.toLocaleString()}%
                                                                </tspan>
                                                            </text>
                                                            )
                                                        }
                                                    }}
                                                />
                                            </Pie>
                                        </PieChart>
                                    </div>
                                    <div className="w-fit flex flex-col justify-center gap-2 text-lg font-semibold">
                                        <p className="text-green-300"> Correct {score} </p>
                                        <p className="text-red-500"> Incorrect {quiz.questions.length - score} </p>
                                        <p> High Score {quiz.highScore} </p>
                                    </div>
                                </CardContent>
                            </Card>
                        }
                        
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
                                                                correct[question.id] ? "bg-green-600 border-green-800" : "bg-red-600 border-red-800"
                                                            ) : (
                                                                "border-cyan-800"
                                                            ))} 
                                                            ${submitted && (key == question.correctAnswer && key != selected[question.id]) && "border-green-800 border-dashed"}
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
                                    // count correct answers
                                    const count = Object.values(correct).filter(Boolean).length;
                                    setScore(count);
                                    handleSubmit(count);
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
                        
                        <Card className="w-full h-96">
                            <CardContent className="w-full h-full">
                                <ResponsiveContainer>
                                    <LineChart 
                                        accessibilityLayer
                                        data={progressData} 
                                        margin={{
                                            right: 12, 
                                            left: 12,
                                            top: 8,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="attempt"
                                            tickLine={true}
                                            axisLine={true}
                                            tickMargin={8}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                        />
                                        <Line
                                            dataKey="score"
                                            type="monotone"
                                            stroke="oklch(60.9% 0.126 221.723)"
                                            strokeWidth={2}
                                            dot={false}
                                            animationDuration={800}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}