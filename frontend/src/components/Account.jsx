import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export function Account() {
    const [count, setCount] = useState(0);
    const { userId } = useParams();

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Account Page {userId ? `(userId is ${userId})` : `(no userId detected in url path)`} </h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Testing the router for the landing page! 
                </p>
            </div>
            <Link to="/">
                Back to Home
            </Link>
        </>
    );
} 