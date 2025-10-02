import { useEffect, useState } from "react";
import { useAuth } from "./contexts/Contexts";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "./LoadingOverlay";
import {
    Card, 
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function AccountPage() {
    const { user } = useAuth();
    const [ studySets, setStudySets ] = useState([]);
    const [ loading, setLoading ] = useState(false);
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

                const result = await response.json();
                const studySets = result.userStudySets;

                setStudySets(studySets);
            } catch (err) {
                console.error(`Error getting account info: `, err);
            }
            finally {
                setLoading(false);
            }
        }

        getAccount();
        console.log("called");
    }, []);

    return (
        <>
            { loading && <LoadingOverlay className="fixed" /> }
            <div className='flex flex-col justify-center align-center p-16 text-center gap-10'>
                <h1 className='text-9xl'>
                    Account Page <br></br>
                </h1>
                <h3 className='text-5xl'>
                    Welcome
                </h3>
            </div>

            <div className="flex justify-center align-center h-dvh">
                {studySets.map((studySet) => (
                    <Card 
                        key={ studySet.id }
                        className="w-full max-w-xs max-h-1/5" 
                        onClick={() => console.log("")}
                    >
                        <CardHeader>
                            <CardTitle>
                                <p className="text-xs">
                                    { studySet.public ? "Public" : "Private" }
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <p className="text-4xl">
                                { studySet.name }
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
} 