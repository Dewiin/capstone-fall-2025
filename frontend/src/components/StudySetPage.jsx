import { LoadingOverlay } from "./LoadingOverlay";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent, 
} from "@/components/ui/tabs";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function StudySetPage() {
    const { user } = useAuth();
    const [ loading, setLoading ] = useState(false);
    const [ quiz, setQuiz ] = useState({questions: [{}]});
    const [ deck, setDeck ] = useState({cards: []});
    const [ studySet, setStudySet ] = useState({});
    const [ notesType, setNotesType ] = useState("deck");
    const { studySetId } = useParams();
    const navigate = useNavigate();

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
                                {user.displayName}
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