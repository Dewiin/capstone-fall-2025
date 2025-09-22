import { Navbar01 } from './ui/shadcn-io/navbar-01';
import { useAuth } from './contexts/Contexts';

export function LandingPage() {
    const { user } = useAuth();

    return (
        <>
            <div className='flex flex-col justify-center align-center p-16 text-center gap-10'>
                <h1 className='text-9xl'>
                    Home Page <br></br>
                </h1>
                <h3 className='text-5xl'>
                    {user ? `Welcome, ${user.displayName}` : "Not Logged In"}
                </h3>
            </div>
        </>
    );
} 