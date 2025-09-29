import { useAuth } from './contexts/Contexts';
import { FaBook, FaBrain, FaLightbulb } from "react-icons/fa";

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center text-center px-6 py-16 gap-8">
      {/* Headline */}
      <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">
        Brainstorm
      </h1>

      {/* Tagline */}
      <p className="mt-2 text-2xl text-gray-550">
        Smarter studying. Powered by AI.
      </p>

      {/* Subtext */}
      <p className="mt-4 text-xl max-w-3xl text-gray-450 leading-relaxed">
        Brainstorm is an AI-powered study app that helps you organize ideas and
        create study guides, making learning smarter and faster.
      </p>

      {/* Features Row */}
      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-8">
        {/* Feature 1 */}
        <div className="flex flex-col items-center gap-3 max-w-xs">
          <FaBook className="text-4xl text-white" />
          <h3 className="text-xl font-semibold text-gray-100">Generate Study Guides</h3>
          <p className="text-gray-300 text-center">
            Quickly turn your notes into structured study guides.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center gap-3 max-w-xs">
          <FaBrain className="text-4xl text-white" />
          <h3 className="text-xl font-semibold text-gray-100">AI-Powered Learning</h3>
          <p className="text-gray-300 text-center">
            Get AI suggestions to help remember key concepts faster.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center gap-3 max-w-xs">
          <FaLightbulb className="text-4xl text-white" />
          <h3 className="text-xl font-semibold text-gray-100">Organize Smarter</h3>
          <p className="text-gray-300 text-center">
            Keep all your study materials neat and accessible.
          </p>
        </div>
      </div>
    </div>
  );
}