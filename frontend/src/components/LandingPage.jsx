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
import landingPageImage from "@/assets/landingPageImage.png";
import { FaGithub, FaLinkedin } from "react-icons/fa";


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

        <div className="flex flex-col md:flex-row justify-center md:items-start items-center gap-10">
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


    {/* Landing Page Banner Image */}
    <section className="w-full my-12">
      <img 
        src={landingPageImage} 
        alt="Brainstorm banner"
        className="w-full h-auto object-cover rounded-2xl"
      />
    </section>


      {/* Team Section */}
      <section 
        className="w-full max-w-6xl mx-auto px-6 py-16 my-12"
        id="team"
      >
        <div className="flex flex-col lg:flex-row lg:items-start items-center gap-12">
          {/* Title/Side Text */}
          <div className="lg:w-1/3 text-left">
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Meet the five Hunter College students behind Brainstorm.
            </p>
          </div>

          {/* Team Cards */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Fatima", role: "Frontend Developer", github: "https://github.com/fatimasif", linkedin: null },
              { name: "Alex", role: "Frontend Developer", github: "https://github.com/alexdoesnotexist1", linkedin: null },
              { name: "Christopher", role: "Frontend Developer", github: "https://github.com/ChristopherZanabria", linkedin: "https://www.linkedin.com/in/christopher-zanabria/" },
              { name: "Moshe", role: "Backend Developer", github: "https://github.com/mokills", linkedin: null },
              { name: "Devin", role: "Backend Developer", github: "https://github.com/dewiin", linkedin: "https://www.linkedin.com/in/devin-xie-a74a45257/" },
            ].map((member) => (
              <div 
                key={member.name} 
                className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-semibold dark:text-gray-100">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{member.role}</p>
                
              <div className="flex gap-4 mt-3">
              {/* GitHub Icon */}
              <a 
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400"
              >
              <FaGithub className="text-2xl" />
            </a>

            {/* LinkedIn Icon (only if provided) */}
            {member.linkedin && (
              <a 
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400"
              >
              <FaLinkedin className="text-2xl" />
            </a>
            )}
        </div>
  
              </div>
            ))}
          </div>
        </div>
      </section> 

      <Separator className="max-w-1/2 mx-auto" />


            {/* FAQ Section */}
      <section 
        className="w-full max-w-4xl mx-auto px-8 py-12 my-12 text-left"
        id="faqs"
      >
        <h2 className="text-4xl font-bold mb-8 text-center">FAQs</h2>

        <Accordion type="single" collapsible className="w-full space-y-4">

          {/* Q1 */}
          <AccordionItem value="need-account">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Do I need an account to get started?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              You can browse the landing page without an account, but you'll need one
              to save, generate, and track your study materials.
            </AccordionContent>
          </AccordionItem>

          {/* Q2 */}
          <AccordionItem value="upload-notes">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              How do I upload my notes?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              You can upload PDF files or text directly to the generate page after logging in.
            </AccordionContent>
          </AccordionItem>

          {/* Q3 */}
          <AccordionItem value="file-types">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              What file types does Brainstorm support?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Brainstorm supports PDF files.
            </AccordionContent>
          </AccordionItem>

          {/* Q4 */}
          <AccordionItem value="share-sets">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can I share my study sets with others?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes! Other users can view your study sets on the explore page or search them up if you make them public.
            </AccordionContent>
          </AccordionItem>

          {/* Q5 */}
          <AccordionItem value="edit-generated">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can I edit the study guides or flashcards after they’re generated?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes, you can edit any generated content and save your changes.
            </AccordionContent>
          </AccordionItem>

          {/* Q6 */}
          <AccordionItem value="explore-save">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can I explore or save study sets created by other users?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes. You can browse public study sets and save your favorites to study later.
            </AccordionContent>
          </AccordionItem>

          {/* Q7 */}
          <AccordionItem value="create-account">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              How do I create an account?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              You can sign up using your Google account or put in your username and password directly from the login page.
            </AccordionContent>
          </AccordionItem>

          {/* Q8 */}
          <AccordionItem value="is-free">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Is Brainstorm free to use?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes, all core study features are free. Additional features may be introduced in the future.
            </AccordionContent>
          </AccordionItem>

          {/* Q9 */}
          <AccordionItem value="upload-formats">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can I upload PowerPoints, Word documents, or images?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Currently Brainstorm supports PDFs and text input. Support for additional formats is planned.
            </AccordionContent>
          </AccordionItem>

          {/* Q10 */}
          <AccordionItem value="generation-time">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              How long does generation take?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Most study guides, flashcards, and quizzes generate within a few seconds depending on file size.
            </AccordionContent>
          </AccordionItem>

          {/* Q11 */}
          <AccordionItem value="manage-sets">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can I reorganize, delete, or rename my study sets?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes, all study sets can be managed from your dashboard after logging in.
            </AccordionContent>
          </AccordionItem>

          {/* Q12 */}
          <AccordionItem value="regenerate-content">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can I regenerate a study guide if I don't like the first version?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Yes. You can regenerate modified content anytime.
            </AccordionContent>
          </AccordionItem>  

          {/* Q13 */}
          <AccordionItem value="public-private">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              How do I make my study set public or private?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              You can toggle visibility when saving or editing a study set.
            </AccordionContent>
          </AccordionItem>

          {/* Q14 */}
          <AccordionItem value="other-edit">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Can other people edit my study sets?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Only you can edit your own sets, but others can save a copy to their own account.
            </AccordionContent>
          </AccordionItem>

          {/* Q15 */}
          <AccordionItem value="reset-account">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              How do I reset my account data?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Visit the Settings → Danger Zone section to reset progress, favorites, and study sets.
            </AccordionContent>
          </AccordionItem>

          {/* Q16 */}
          <AccordionItem value="delete-account">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              What happens if I delete my account?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              All your study sets, attempts, and account information are permanently deleted.
            </AccordionContent>
          </AccordionItem>

          {/* Q17 */}
          <AccordionItem value="upload-issues">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Why can’t I upload my file?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Check that your file is under the upload size limit and in PDF format.
            </AccordionContent>
          </AccordionItem>

          {/* New Q18 */}
          <AccordionItem value="content-not-visible">
            <AccordionTrigger className="md:text-xl text-lg font-semibold">
              Why am I not seeing my newly generated content?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-300">
              Try refreshing the dashboard or checking your internet connection.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </section>

      <Footer />
    </div>
  );
}
