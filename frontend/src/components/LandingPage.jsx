import { Link } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect } from 'react';

export function LandingPage() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/api")
        .then(res => res.json())
        .then(data => data.text)
        .then(message => setMessage(message))
    }, [count]);

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
            <h1>Landing Page</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    The secret message is "{message}"
                </p>
            </div>
            <Link to="/account">
                Account page
            </Link>
        </>
    );
} 