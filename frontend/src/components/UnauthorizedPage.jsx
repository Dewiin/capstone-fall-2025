import { Footer } from "./Footer";

export function UnauthorizedPage() {
    return (
        <>
            <div className='flex flex-col justify-center items-center h-screen align-center'>
                <p className="text-slate-400 text-lg">
                    401
                </p>
                <p className="text-slate-500 text-sm">
                    Unauthorized Access.
                </p>
            </div>
            <Footer />
        </>
    );
} 