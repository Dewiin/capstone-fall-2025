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
import { 
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components/ui/avatar';

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
                if(!response.ok) {
                    console.error(`Error getting a response for study set: `, response.status);
                    return;
                }

                const result = await response.json();

                if(result.status == 1) {
                    const studySets = result.userStudySets;
                    setStudySets(studySets);
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

    return (
        <>
            <div className='flex flex-col justify-center items-center p-24 gap-5'>
                <Avatar className="size-30 rounded-2xl">
                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                    <AvatarFallback>Icon</AvatarFallback>
                </Avatar>
                <h3 className='text-3xl '>
                    {user?.displayName}
                </h3>
            </div>

            <div className="flex flex-col justify-center items-center align-center gap-12 relative">
                { loading && <LoadingOverlay /> }
                { !loading &&
                    <p className="text-xl">My Study Sets</p>
                }
                <div className="flex flex-wrap justify-center gap-4 h-full w-full">
                    {studySets.map((studySet) => (
                        <Card 
                            key={ studySet.id }
                            className="w-full max-w-xs h-35 select-none" 
                            onClick={() => navigate(`/study-set/${studySet.id}`)}
                        >
                            <CardHeader className="relative">
                                <p className="text-xs absolute top-0 left-5">
                                    { studySet.public ? "Public" : "Private" }
                                </p>
                            </CardHeader>
                            <CardContent className="flex  justify-center h-full">
                                <p className="text-3xl">
                                    { studySet.name }
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
} 