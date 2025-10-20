import { LuFacebook, LuInstagram, LuYoutube, LuLinkedin } from "react-icons/lu";
import { GiBrainstorm } from "react-icons/gi";
import { FaGithub } from "react-icons/fa";
import { Separator } from '@/components/ui/separator'

export function Footer() {
    return (
        <footer className="w-full mt-12">
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