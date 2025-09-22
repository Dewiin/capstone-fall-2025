import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("http://localhost:3000/api", {
                    method: "GET",
                    credentials: "include"
                });
                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                if(data.loggedIn) {
                    setUser({
                        id: data.id,
                        username: data.username,
                        displayName: data.displayName
                    })
                }
                else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Error fetching user in AuthProvider:", err);
                setUser(null);
            }
        }

        fetchUser();
    }, [user]);

    async function signup(data) {
        try {
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();

            if(result.loggedIn) {
                setUser({
                    id: result.id,
                    username: result.username,
                    displayName: result.displayName
                })
            } else {
                setUser(null);
            }

            return result;
        } catch (err) {
            setUser(null);
            console.error(`Error signing up: `, err);
            return {
                loggedIn: false,
            }
        }
    }

    async function login(data) {
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();

            if(result.loggedIn) {
                setUser({
                    id: result.id,
                    username: result.username,
                    displayName: result.displayName,
                })
            }
            else {
                setUser(null);
            }

            return result;
        } catch (err) {
            setUser(null);
            return {
                loggedIn: false,
            }
        }
    }

    async function logout() {
        try {
            const response = await fetch("http://localhost:3000/api/logout", {
                method: "POST",
                credentials: "include",
            });
            const result = await response.json();
            if (!result.loggedIn) {
                setUser(null);
            }

            return result;
        } catch (err) {
            console.error(`Error logging out: `, err);
        }
    }
    
    const value = {
        user,
        signup,
        login,
        logout
    }

    return (
        <AuthContext value={value}>
            {children}
        </AuthContext>
    )
}

export function useAuth() {
    return useContext(AuthContext);        
}
