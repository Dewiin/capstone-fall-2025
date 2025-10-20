import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function StudySetPage() {
    const { user } = useAuth();
    const [ notesType, setNotesType ] = useState("deck");
    const [ loading, setLoading ] = useState(false);
    const { studySetId } = useParams();
    const smoothScroll = useRef(null);
    const navigate = useNavigate();
    const [ searchParams, setSearchParams ] = useSearchParams();

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
    
    // pie chart
    const [ chartData, setChartData ] = useState([]);
    const [ progressData, setProgressData ] = useState([]);

    // line chart
    const [ globalAttempts, setGlobalAttempts ] = useState(null);
    const [ globalAverageScore, setGlobalAverageScore ] = useState(null);
    const [ userAverageScore, setUserAverageScore ] = useState(null);

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
                    const allAttempts = result.studySet.quiz.attempts.map((attempt, index) => ({
                        attempt: index + 1,
                        score: attempt.score,
                    }));
                    setProgressData(allAttempts);

                    setStudySet(result.studySet);
                    setQuiz(result.studySet.quiz);
                    setDeck(result.studySet.deck);
                    setGlobalAttempts(result.globalAttempts);
                    setGlobalAverageScore(result.globalAverageScore);
                    setUserAverageScore(result.userAverageScore);
                    
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
    }, [score, quiz, submitted]);

    useEffect(() => {
        if (smoothScroll.current) {
            smoothScroll.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [submitted]);

    async function handleSubmit(score) {
        setLoading(true);

        if (submitted) {
            setSubmitted(false);
            setScore(0);
            setCorrect({});
            setSelected({});
            setLoading(false);
            return;
        } 

        try {
            // update database (attempts & highScore)
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
                setGlobalAttempts(result.globalAttempts);
                setGlobalAverageScore(result.globalAverageScore);
                setUserAverageScore(result.userAverageScore);

                const allAttempts = result.quiz.attempts.map((attempt, index) => ({
                    attempt: index + 1,
                    score: attempt.score,
                }));
                setProgressData(allAttempts);

                setSubmitted(true);
            } else {
                console.error(`Quiz not found`);
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
        <div className="select-none"> 
            <div 
                className="md:p-24 p-8 h-full min-w-sm"
                ref={smoothScroll}
            >
                <Breadcrumb className="p-6">
                    <BreadcrumbList className="text-muted-foreground">
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="select-none"
                                onClick={() => {
                                    if(searchParams.get("explore")) {
                                        navigate(`/explore`);
                                    } else {
                                        navigate(`/account/${user.id}`);
                                    }
                                }}
                            >
                                {searchParams.get("explore") ? "Explore" : user?.displayName}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage> { loading ? "..." : studySet.name } </BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                { notesType.charAt(0).toLocaleUpperCase() + notesType.slice(1) } 
                            </BreadcrumbPage> 
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Tabs
                    defaultValue={notesType}
                    className="flex gap-12 min-h-screen"
                    onValueChange={(val) => {
                        setNotesType(val);
                    }}
                >
                    <TabsList 
                        className="m-auto dark:bg-slate-950 bg-indigo-200 border-1 dark:border-indigo-200 border-indigo-900"
                    >
                        <TabsTrigger 
                            value="deck"
                            className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                        >
                            Deck 
                        </TabsTrigger>    
                        <TabsTrigger 
                            value="quiz"
                            className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                        > 
                            Quiz 
                        </TabsTrigger>    
                        <TabsTrigger 
                            value="progress"
                            className="data-[state=active]:bg-[rgba(255,255,255,0.5)]"
                        > 
                            Progress 
                        </TabsTrigger>    
                    </TabsList>
                    {/* ------------------------------------------------------- DECK ------------------------------------------------------- */}
                    <TabsContent 
                        value="deck"
                        className="flex flex-col items-center gap-2 relative"
                    >
                        { loading && <LoadingOverlay /> }

                        { !loading && 
                        <>
                            <Carousel
                                className="w-full md:w-2xl md:aspect-video w-2xs mb-5"
                                setApi={setApi}
                                opts={{
                                    loop: true,
                                }}
                            >
                                <CarouselContent>
                                    { deck.cards.map((card) => (
                                        <CarouselItem key={card.id}>
                                            <Card 
                                                className="aspect-video justify-center items-center md:p-20 p-8 overflow-hidden
                                                    dark:bg-slate-950 bg-indigo-200
                                                    border-1 dark:border-indigo-200 border-indigo-900
                                                    dark:text-indigo-50 text-indigo-950"
                                                onClick={() => setFlipped((prev) => {
                                                    return {
                                                        ...prev,
                                                        [card.id]: !prev[card.id],
                                                    }
                                                })}
                                            >
                                                <CardContent className="flex overflow-scroll no-scrollbar">
                                                    { flipped[card.id] ? (
                                                        <div className="flex flex-col h-full gap-2">
                                                            <span className="md:text-sm text-xs text-gray-500">
                                                                {card.question}
                                                            </span>
                                                            <span className="md:text-xl text-sm font-semibold">
                                                                {card.answer}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="md:text-xl font-semibold">
                                                            {card.question}
                                                        </span>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
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

                            {deck.cards.map((card) => (
                                <Card 
                                    key={card.id}
                                    className="md:w-3xl w-full h-40
                                        dark:bg-slate-900 bg-indigo-100 
                                        border-1 dark:border-indigo-200 border-indigo-900
                                        dark:text-indigo-50 text-indigo-950"
                                >
                                    <CardContent className="flex justify-between h-full">
                                        {/* Question */}
                                        <div className="md:w-3xs w-1/2 max-h-full overflow-scroll no-scrollbar text-sm md:mx-auto mx-4">
                                            <p className="whitespace-pre-wrap">{card.question}</p>
                                        </div>

                                        {/* Divider */}
                                        <Separator orientation="vertical" className="border-1 border-indigo-300" />

                                        {/* Answer */}
                                        <div className="md:w-3xs w-1/2 max-h-full overflow-scroll no-scrollbar text-sm md:mx-auto mx-4">
                                            <p className="whitespace-pre-wrap">{card.answer}</p>
                                        </div>
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
                            <Card className="md:items-start bg-transparent shadow-none items-center md:w-2xl w-sm mb-5 border-none md:p-6 p-12">
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
                                                animationBegin={800}
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
                                        <p className="dark:text-green-400 text-green-700"> Correct {score} </p>
                                        <p className="dark:text-red-400 text-red-700"> Incorrect {quiz.questions.length - score} </p>
                                        <p className="dark:text-indigo-200 text-indigo-950"> High Score {quiz.highScore} </p>
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
                                            className="aspect-video md:p-12 py-12 relative
                                                dark:bg-slate-950 bg-indigo-200
                                                border-1 dark:border-indigo-200 border-indigo-900"
                                        >
                                            <p className="absolute top-5 right-5 text-gray-500">
                                                {index+1} of {quiz.questions.length}
                                            </p>
                                            <CardHeader>
                                                <CardTitle className="md:text-base text-sm">
                                                    {question.question}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid sm:grid-cols-2 grid-cols-1 h-1/1.5 gap-6">
                                                    {Object.entries(question.choices).map(([key, value]) => (
                                                        <Card 
                                                            key={key}
                                                            className={
                                                                `md:text-sm text-xs cursor-pointer
                                                                dark:bg-[rgba(255,255,255,0.1)]
                                                                bg-[rgba(255,255,255,0.3)] 
                                                                ${key == selected[question.id] &&
                                                                (submitted ?
                                                                (
                                                                    correct[question.id] ? "dark:bg-green-900 bg-green-200 border-green-400" : "dark:bg-red-900 bg-red-200 border-red-400"
                                                                ) : (
                                                                    "border-indigo-700 dark:border-indigo-50"
                                                                ))} 
                                                                ${submitted && (key == question.correctAnswer && key != selected[question.id]) && "dark:border-green-500 border-green-700 border-dashed"}
                                                                border-2`
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
                                            </CardContent>
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
                        
                        <Card 
                            className="md:w-4xl mx-auto md:h-96 h-50
                                dark:bg-slate-950 bg-indigo-300
                                border-2 dark:border-indigo-200 border-indigo-900"
                        >
                            <CardContent className="w-full h-full">
                                { progressData.length == 0 ? (
                                    <div className=" flex w-full h-full justify-center items-center text-lg font-semibold">
                                        <p>
                                            No progress data available.
                                        </p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer>
                                        <LineChart
                                            accessibilityLayer
                                            data={progressData} 
                                            margin={{
                                                right: 12, 
                                                left: -30,
                                                top: 8,
                                            }}
                                        >
                                            <CartesianGrid stroke="none" />
                                            <XAxis
                                                dataKey="attempt"
                                                stroke="var(--primary)"
                                                tickLine={true}
                                                axisLine={true}
                                                tickMargin={8}
                                            />
                                            <YAxis
                                                type="number"
                                                stroke="var(--primary)"
                                                domain={[0, quiz.questions.length]}
                                            />
                                            <Tooltip
                                                cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 2 }}
                                                content={<CustomTooltip />}
                                            />
                                            <Line
                                                dataKey="score"
                                                type="monotone"
                                                stroke="var(--primary)"
                                                strokeWidth={2}
                                                dot={false}
                                                animationDuration={1000}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        <Card 
                            className="md:w-4xl mx-auto my-16
                            dark:bg-slate-900 bg-indigo-200
                            border-2 dark:border-indigo-200 border-indigo-800
                            "
                        >
                            <CardHeader>
                                <CardTitle>
                                    Quiz Data
                                </CardTitle>
                                <CardDescription>
                                    Some information on this quiz
                                </CardDescription>
                            </CardHeader>
                            <CardContent
                                className="flex md:flex-row flex-col md:gap-0 gap-2 md:h-15 md:justify-evenly"
                            >
                                <div 
                                    className="flex-1 grid md:grid-cols-2 grid-cols-1 md:px-6"
                                >
                                    <span>
                                        <p 
                                            className="md:text-sm text-xs/2 dark:text-indigo-300 text-indigo-900"
                                        >
                                            global attempts recorded
                                        </p>
                                        <p
                                            className="md:text-3xl text-xl font-semibold"
                                        >
                                            {globalAttempts != null ? globalAttempts : "..."}
                                        </p>
                                    </span>
                                    <span>
                                        <p 
                                            className="md:text-sm text-xs/2 dark:text-indigo-300 text-indigo-900"
                                        >
                                            global average score
                                        </p>
                                        <p
                                            className="md:text-3xl text-xl font-semibold"
                                        >
                                            {globalAverageScore != null ? globalAverageScore : "..."}
                                        </p>
                                    </span>
                                </div>

                                <Separator orientation="vertical" className="dark:border-indigo-300 border-indigo-800 border-2 md:block hidden rounded-lg" />

                                <div
                                    className="flex-1 grid md:grid-cols-2 grid-cols-1 md:px-6"
                                >
                                    <span>
                                        <p 
                                            className="md:text-sm text-xs/2 dark:text-indigo-300 text-indigo-900"
                                        >
                                            your attempts recorded
                                        </p>
                                        <p 
                                            className="md:text-3xl text-xl font-semibold"
                                        >
                                            {quiz?.attempts ? quiz.attempts.length : "..."}
                                        </p>
                                    </span>
                                    <span>
                                        <p 
                                            className="md:text-sm text-xs/2 dark:text-indigo-300 text-indigo-900"
                                        >
                                            your average score
                                        </p>
                                        <p
                                            className="md:text-3xl text-xl font-semibold"
                                        >   
                                            {userAverageScore != null ? userAverageScore : "..."}
                                        </p>
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}