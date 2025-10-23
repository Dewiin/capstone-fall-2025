import { Footer } from "./Footer";

export function ForbiddenPage() {
    return (
        <>
            <div className='flex flex-col justify-center items-center h-screen align-center'>
                <p className="text-slate-400 text-lg">
                    403
                </p>
                <p className="text-slate-500 text-sm">
                    You do not have permission to access this resource.
                </p>
            </div>
            <Footer />
        </>
    );
} 