import { LoadingOverlay } from "./LoadingOverlay";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate, useParams } from "react-router-dom";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function StudySetPage() {
    const { user, loading, setLoading } = useAuth();
    const [ quiz, setQuiz ] = useState({});
    const [ deck, setDeck ] = useState({});
    const [ studySet, setStudySet ] = useState({});
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
            <div className="flex flex-col w-full h-[80dvh] justify-center items-center gap-32">
                <p className="scroll-m-20 text-center text-4xl font-extrabold text-6xl tracking-tight text-balance">
                    { studySet.name }
                </p>
                <div className="flex justify-center items-center gap-12 w-full h-1/4">
                    <Card 
                        className="flex justify-center w-full max-w-xs h-full cursor-pointer" 
                        onClick={() => navigate(`/deck/${deck.id}`)}
                    >
                        <CardContent className="flex items-center justify-center font-extrabold">
                            <p className="text-4xl">
                                Deck
                            </p>
                        </CardContent>
                    </Card>
                    <Card 
                        className="flex justify-center w-full max-w-xs h-full cursor-pointer" 
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                        <CardContent className="flex items-center justify-center font-extrabold">
                            <p className="text-4xl">
                                Quiz
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}