import { useAuth } from './contexts/Contexts';
import { FaBook, FaBrain, FaLightbulb, FaCompass } from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";
import { FlipButton } from '@/components/ui/shadcn-io/flip-button';
import { Separator } from '@/components/ui/separator';
import { Footer } from './Footer';
import { useNavigate } from 'react-router-dom';

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

      <Separator className="max-w-1/2" />

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
