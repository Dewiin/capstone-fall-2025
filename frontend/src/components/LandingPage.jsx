import { useAuth } from './contexts/Contexts';
import { FaBook, FaBrain, FaLightbulb, FaCompass } from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";
import { FlipButton } from '@/components/ui/shadcn-io/flip-button';
import { Separator } from '@/components/ui/separator';
import { Footer } from './Footer';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";


export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center">
      {/* Hero Section */}
      <section 
        className="flex flex-col items-center justify-center rounded-4xl text-center px-6 py-20 bg-gradient-to-b from-indigo-100 to-indigo-500 dark:from-indigo-900 dark:to-indigo-300 w-full my-12"
        id="hero"
      >
        <h1 className="text-6xl font-bold text-gray-900 tracking-tight sm:text-7xl mb-4">
          Brainstorm
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6">
          Smarter studying. Powered by AI.
        </p>
        <p className="max-w-2xl text-lg text-gray-800 dark:text-gray-700 leading-relaxed mb-10">
          Brainstorm is an AI-powered study app that helps you organize ideas,
          create study guides, and study more effectively, all in one place.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FlipButton 
            className="px-8 py-4 font-semibold whitespace-nowrap w-40" 
            frontText={ user ? "Create" : "Get Started" } 
            frontClassName="dark:bg-primary dark:text-secondary bg-gray-900 text-secondary"
            backText={ user ? "Generate Study Sets" : "Sign Up" }
            backClassName="dark:bg-gray-900 dark:text-gray-200 bg-secondary text-gray-900"
            onClick={() => navigate(user ? "/generate" : "/form/signup")}
          />
        </div>
      </section>


      {/* Features Section */}
      <section 
        className="w-full max-w-6xl mx-auto px-8 py-12 text-center my-12" 
        id='features'
      >
        <h2 className="text-4xl font-bold mb-10">Features</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          <div className="flex flex-col items-center gap-4 max-w-xs">
            <FaBook className="text-5xl text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold dark:text-gray-100">Generate Study Guides</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quickly turn your notes into structured study guides.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-xs">
            <RiGeminiFill className="text-5xl text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold dark:text-gray-100">AI-Powered Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get intelligent suggestions to help remember key concepts faster.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-xs">
            <FaLightbulb className="text-5xl text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold dark:text-gray-100">Organize Smarter</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep all your study materials neatly organized and accessible anytime.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-xs">
            <FaCompass className="text-5xl text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold dark:text-gray-100">Explore Study Sets</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Browse study sets created by others and save your favorites to learn from.
            </p>
          </div>
        </div>
      </section>

      <Separator className="max-w-1/2" />

      {/* About Section */}
      <section 
        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-12 gap-10 text-left my-12"
        id="about"
      >
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4">About Brainstorm</h2>
          <p className="text-md text-gray-600 dark:text-gray-300 leading-relaxed">
            Brainstorm was created to help students study smarter, not harder.
            By using AI to streamline the creation of personalized study materials, 
            it helps you focus on learning rather than organizing.
          </p>
          <p className="mt-4 text-md text-gray-600 dark:text-gray-300 leading-relaxed">
            Whether you're preparing for an exam or reviewing lecture material, 
            Brainstorm gives you the tools to learn efficiently and effectively.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <FaBrain className="text-8xl text-indigo-500 dark:text-indigo-400" />
        </div>
      </section>

      <Separator className="max-w-1/2" />


      {/* How It Works Section */}
      <section 
        className="w-full max-w-6xl mx-auto px-8 py-12 text-center my-12" 
        id="how-it-works"
      >
        <h2 className="text-4xl font-bold mb-10">How It Works</h2>

        <div className="flex flex-col md:flex-row justify-center items-start gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center max-w-xs text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full p-6 mb-4">
              <FaBook className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold dark:text-gray-100 mb-2">1. Upload Notes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your lecture notes as PDFs, or text files to Brainstorm in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center max-w-xs text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full p-6 mb-4">
              <FaLightbulb className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold dark:text-gray-100 mb-2">2. AI Generates Guides</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Brainstorm’s AI creates structured study guides and flashcards.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center max-w-xs text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full p-6 mb-4">
              <FaBrain className="text-4xl" />
            </div>
            <h3 className="text-xl font-semibold dark:text-gray-100 mb-2">3. Study Smarter</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Review your AI-generated study materials anytime to learn faster and retain more.
            </p>
          </div>
        </div>
      </section>
      
    {/* Disclaimer Section */}
    <section 
      className="w-full max-w-4xl mx-auto px-8 py-10 my-12 bg-indigo-50 dark:bg-indigo-950 rounded-3xl shadow-sm"
      id="disclaimer"
    >
      <h2 className="text-3xl font-bold mb-6 text-center dark:text-gray-100">Powered by Gemini</h2>

      <div className="text-left">
        <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed mb-4">
          Brainstorm uses <strong>Google’s Gemini AI</strong> to enhance your studying experience. 
          Please use this tool responsibly. It is designed to help you learn and study more effectively.
        </p>

        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-md leading-relaxed mb-4">
          <li>Don’t use Brainstorm or Gemini for harmful, offensive, or abusive content.</li>
          <li>Use this platform for studying, learning, and educational purposes only.</li>
          <li>Be mindful that AI responses may not always be 100% accurate.</li>
        </ul>

        <p className="text-gray-700 dark:text-gray-300 text-md">
          To learn more about Gemini, visit{" "}
          <a 
            href="https://gemini.google/about/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-500 hover:underline"
          >
            Google Gemini
          </a>.
        </p>
      </div>
    </section>


      <Separator className="max-w-1/2" /> 

    {/* FAQ Section */}
    <section 
      className="w-full max-w-4xl mx-auto px-8 py-12 my-12 text-left"
      id="faqs"
    >
      <h2 className="text-4xl font-bold mb-8 text-center">FAQs</h2>

      <Accordion type="single" collapsible className="w-full space-y-4">

        {/* General */}
        <AccordionItem value="general">
          <AccordionTrigger className="text-2xl font-semibold">
            General
          </AccordionTrigger>
          <AccordionContent className="space-y-4 mt-4">

            <div>
              <h4 className="font-semibold text-lg">Do I need an account to get started?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                You can browse the landing page without an account, but you'll need one
                to save, generate, and track your study materials.
              </p>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* How It Works */}
        <AccordionItem value="how-it-works">
          <AccordionTrigger className="text-2xl font-semibold">
            How It Works
          </AccordionTrigger>
          <AccordionContent className="space-y-4 mt-4">

            <div>
              <h4 className="font-semibold text-lg">How do I upload my notes?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                You can upload PDF files or text directly to the generate page after logging in.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">What file types does Brainstorm support?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Brainstorm supports PDF fils.
              </p>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* Features & Tools */}
        <AccordionItem value="features-tools">
          <AccordionTrigger className="text-2xl font-semibold">
            Features and Tools
          </AccordionTrigger>
          <AccordionContent className="space-y-4 mt-4">

            <div>
              <h4 className="font-semibold text-lg">Can I share my study sets with others?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Other users can view your study sets on the explore page or search them up if you make them public.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                Can I edit the study guides or flashcards after they’re generated?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can edit any generated content and save your changes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                Can I explore or save study sets created by other users?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Yes. You can browse public study sets and save your favorites to study later.
              </p>
            </div>

          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </section>

   <Separator className="max-w-1/2" /> 

      {/* Team Section */}
      <section 
        className="w-full max-w-6xl mx-auto px-8 py-12 text-center my-12"
        id="team"
      >
        <h2 className="text-4xl font-bold mb-6">Meet the Team</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
          Meet the team of five undergraduate students at Hunter College working together on Brainstorm: 
          an AI-powered study app designed to help students learn smarter and stay organized.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          <div className="flex flex-col items-center text-center max-w-xs">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Fatima</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Frontend Developer</p>
            <a 
              href="https://github.com/fatimasif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-sm mt-1"
            >
              @fatimasif
            </a>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Alex</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Frontend Developer</p>
            <a 
              href="https://github.com/alexdoesnotexist1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-sm mt-1"
            >
              @alexdoesnotexist1
            </a>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Christopher</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Frontend Developer</p>
            <a 
              href="https://github.com/ChristopherZanabria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-sm mt-1"
            >
              @ChristopherZanabria
            </a>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Moshe</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Backend Developer</p>
          </div>

          <div className="flex flex-col items-center text-center max-w-xs">
            <h3 className="text-2xl font-semibold dark:text-gray-100">Devin</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Backend Developer</p>
            <a 
              href="https://github.com/dewiin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-sm mt-1"
            >
              @dewiin
            </a>
          </div>
        </div>

        <p className="mt-10 text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Together, we built Brainstorm to empower students with smarter, AI-driven study tools to make learning easier for everyone.
        </p>
      </section> 

      <Footer />
    </div>
  );
}
