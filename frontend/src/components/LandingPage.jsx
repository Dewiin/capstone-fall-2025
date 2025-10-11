import { useAuth } from './contexts/Contexts';
import { FaBook, FaBrain, FaLightbulb } from "react-icons/fa";
import { RippleButton } from '@/components/ui/shadcn-io/ripple-button';
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
      <section className="flex flex-col items-center justify-center rounded-4xl text-center px-6 py-20 bg-gradient-to-b from-indigo-100 to-indigo-500 dark:from-indigo-900 dark:to-indigo-300 w-full my-12">
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
          {/* <RippleButton 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold"
          >
            Start Generating
          </RippleButton>
          <RippleButton 
            size="lg" 
            variant="secondary" 
            className="px-8 py-4 text-lg font-semibold"
          >
            My Study Sets
          </RippleButton> */}
          <FlipButton 
            className="px-8 py-4 font-semibold whitespace-nowrap w-40" 
            frontText={ user ? "Create" : "Get Started" } 
            frontClassName="bg-primary dark:text-secondary text-secondary"
            backText={ user ? "Generate Study Sets" : "Sign Up" }
            backClassName="bg-secondary text-primary"
            onClick={() => navigate(user ? "/generate" : "/form/signup")}
          />
        </div>
      </section>

      {/* Divider */}
      <Separator className="max-w-1/2" />

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-8 py-12 text-center my-12">
        <h2 className="text-4xl font-bold mb-10">Features</h2>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
          <div className="flex flex-col items-center gap-4 max-w-xs">
            <FaBook className="text-5xl text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold dark:text-gray-100">Generate Study Guides</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quickly turn your notes into structured study guides.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-xs">
            <FaBrain className="text-5xl text-indigo-500 dark:text-indigo-400" />
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
        </div>
      </section>

      {/* Divider */}
      <Separator className="max-w-1/2" /> 

      {/* About Section */}
      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-12 gap-10 text-left my-12">
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}