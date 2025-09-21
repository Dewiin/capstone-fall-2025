import { Navbar01 } from "./ui/shadcn-io/navbar-01";

export function PageNotFound() {
    return (
        <>
            <div className="relative w-full">
                <Navbar01 />
            </div>
            <div className='flex justify-center align-center p-16 text-9xl text-center'>
                <h1>
                    404 Page Not Found :(
                </h1>
            </div>
        </>
    );
} 