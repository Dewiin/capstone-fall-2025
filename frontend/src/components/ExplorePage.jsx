import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { 
  Card, 
  CardDescription, 
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { FaBook, FaHeart } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function ExplorePage() {
  const allCategories = useRef([
    "SCIENCE", 
    "MATH",
    "HISTORY",
    "LANGUAGE",
    "TECHNOLOGY",
    "ART",
    "BUSINESS",
    "OTHER"
  ]);
  const [ categories, setCategories ] = useState([]);
  const [ studySets, setStudySets ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL_DOMAIN}/api/explore`, {
          method: "GET", 
          credentials: "include",
        });
        if(!response.ok) {
          console.error(`Error getting a response for categories: `, response.status);
          return;
        }

        const result = await response.json();
        if(result.status === 1) {
          setStudySets(result.studySets);
          setCategories(result.categoryCounts);
        }
        else {
          console.error(`Error finding study sets`)
        }
      } catch (err) {
        console.error(`Error fetching categories: `, err);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-3xl min-h-screen mx-auto md:mt-24 md:p-0 p-8">
      {/* Search Bar */}
      <div className="flex flex-col gap-2">
        <p 
          className="font-extrabold"
        >
          Search
        </p>
        <Input 
          type="text" 
          placeholder="Search for a study set..." 
          className="dark:bg-slate-900 bg-indigo-200
          border-1 dark:border-indigo-100 border-indigo-900"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <p
          className="font-extrabold"
        >
          Categories
        </p>
        <div className="grid sm:grid-cols-4 grid-cols-2 grid-rows-2 gap-2">
          { allCategories.current.map((category) => (
            <Card
              className="p-4 py-2 flex-row items-center gap-2 w-xs/2 rounded-sm cursor-pointer
              dark:bg-slate-950 bg-blue-200
              border-1 dark:border-indigo-200 border-indigo-900"
            >
              <FaBook size={28} />
              <CardHeader className="p-0 w-20 gap-0">
                <CardTitle className="text-sm">
                  {category.charAt(0) + category.slice(1).toLocaleLowerCase()}
                </CardTitle>
                <CardDescription className="text-xs/2">
                  {categories[category] ? categories[category] : "0"} study sets
                </CardDescription>
              </CardHeader>
            </Card>
          )) }
        </div>  
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <p className="font-extrabold">
          Popular study sets
        </p>
        <div className="relative grid grid-cols-2 gap-2">
          { loading && <LoadingOverlay className="my-24" /> }
          { studySets?.map((studySet) => (
            <Card
              className="cursor-pointer 
              dark:bg-slate-900 bg-indigo-200 
              border-1 border-indigo-700 dark:border-indigo-200"
              onClick={() => navigate(`/study-set/${studySet.id}?explore=true`)}
            >
              <CardHeader className="gap-1">
                <CardTitle className="font-bold dark:text-indigo-100 text-indigo-950">
                  {studySet.name}
                </CardTitle>
                <CardDescription
                  className="dark:text-indigo-300 text-indigo-900 flex flex-col gap-1"
                >
                  <p>
                    {studySet.deck.cards.length} flashcards 
                    • {studySet.quiz.attempts.length} quiz attempts
                  </p>
                  <p className="w-fit px-2 rounded-xl text-xs
                  dark:bg-indigo-300 bg-indigo-900
                  dark:text-indigo-900 text-indigo-200">
                    {studySet.public ? "Public " : "Private "}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2">
                <p className="flex gap-1 items-center justify-start text-sm font-semibold">
                  <Avatar className="size-6 rounded-2xl">
                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                    <AvatarFallback>Icon</AvatarFallback>
                  </Avatar>
                  { studySet.user.displayName }
                </p>
                <p className="flex items-center gap-1 text-sm font-semibold dark:text-indigo-100 text-indigo-950 justify-end">
                  {studySet["_count"].favoritedBy}
                  <FaHeart /> 
                </p>
              </CardContent>
          </Card>
        )) }
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )  
}