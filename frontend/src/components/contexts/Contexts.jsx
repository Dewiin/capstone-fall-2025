import { createContext, useState, useContext, useEffect } from 'react';
import { LoadingOverlay } from '../LoadingOverlay';
const AuthContext = createContext();

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN

export default function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) {
                setUser(null);
                return;
            }

            const result = await response.json();
            if(result.loggedIn) {
                setUser({
                    id: result.id,
                    username: result.username,
                    displayName: result.displayName
                })
            }
            else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user in AuthProvider:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function signup(data) {
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            if (!response.ok) {
                setUser(null);
                return;
            }

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
            };
        }
    }

    async function login(data) {
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            if(!response.ok) {
                setUser(null);
                return;
            }
            
            const result = await response.json();
            if(result.loggedIn) {
                setUser({
                    id: result.id,
                    username: result.username,
                    displayName: result.displayName,
                });
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

    function googleLogin() {
        window.location.href = `${API_URL_DOMAIN}/api/auth/google`;
    }

    async function logout() {
        try {
            const response = await fetch(`${API_URL_DOMAIN}/api/logout`, {
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
        fetchUser,
        user,
        signup,
        login,
        googleLogin,
        logout,
    }

    return (
        <AuthContext value={value}>
            {loading && <LoadingOverlay fixed />}
            {children}
        </AuthContext>
    )
}

export function useAuth() {
    return useContext(AuthContext);        
}
