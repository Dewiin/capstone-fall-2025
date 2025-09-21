import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Navbar01 } from './ui/shadcn-io/navbar-01';

export function LandingPage() {
    const darkMode = useRef(true);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]); 

    return (
        <>
            <div className="relative w-full">
                <Navbar01 />
            </div>
            <ul>
                <li>
                    <Link to="/account">
                        Account Profile
                    </Link>
                </li>
            </ul>
        </>
    );
} 