

export function Account() {
    return (
        <>
            <div className='flex flex-col justify-center align-center p-16 text-center gap-10'>
                <h1 className='text-9xl'>
                    Account Page <br></br>
                </h1>
                <h3 className='text-5xl'>
                    {user ? `Welcome, ${user.displayName}` : "Not Logged In"}
                </h3>
            </div>
        </>
    );
} 