import { Navbar01 } from './ui/shadcn-io/navbar-01';

export function LandingPage() {
    return (
        <>
            <div className="relative w-full">
                <Navbar01 />
            </div>
            <div className='flex justify-center align-center p-16 text-9xl text-center'>
                <h1>
                    Home Page
                </h1>
            </div>
        </>
    );
} 