import { LuFacebook, LuInstagram, LuYoutube, LuLinkedin } from "react-icons/lu";
import { GiBrainstorm } from "react-icons/gi";
import { FaGithub } from "react-icons/fa";
import { Separator } from '@/components/ui/separator'

export function Footer() {
    return (
        <footer className="w-full mt-12">
            {/* <Separator />
            <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8'>
                <a href='#'>
                    <div className='flex items-center gap-3'>
                        <GiBrainstorm className="text-2xl" />
                        <p className="font-extrabold text-xl">
                            Brainstorm
                        </p>
                    </div>
                </a>

                <div className='flex items-center gap-5 whitespace-nowrap'>
                    <a href='#'>About</a>
                    <a href='#'>Features</a>
                    <a href='#'>Works</a>
                    <a href='#'>Career</a>
                </div>

                <div className='flex items-center gap-4'>
                    <a href='#'>
                        <LuFacebook className='size-5' />
                    </a>
                    <a href='#'>
                        <LuInstagram className='size-5' />
                    </a>
                    <a href='#'>
                        <LuLinkedin className='size-5' />
                    </a>
                    <a href='#'>
                        <LuYoutube className='size-5' />
                    </a>
                </div>
            </div> */}

            <Separator />

            <div className='mx-auto flex flex-col max-w-7xl justify-center px-4 py-6 sm:px-6 gap-2'>
                <p className='text-center font-medium text-balance text-sm'>
                    ©2025 <a href='#'>Brainstorm</a>, Made with ❤️ for you.
                </p>
                <a className="mx-auto text-xl" href="https://github.com/Dewiin/capstone-fall-2025" target="_blank">
                    <FaGithub />
                </a>
            </div>
        </footer>
    );
}