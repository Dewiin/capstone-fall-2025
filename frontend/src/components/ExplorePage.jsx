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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FaBook, FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdScience, MdComputer, MdMiscellaneousServices } from "react-icons/md";
import { PiMathOperationsBold } from "react-icons/pi";
import { IoLanguageSharp, IoBusinessSharp } from "react-icons/io5";
import { FaPaintbrush } from "react-icons/fa6";
import { useAuth } from "@/components/contexts/Contexts";

const API_URL_DOMAIN = import.meta.env.VITE_API_URL_DOMAIN;

export function ExplorePage() {
  const { user } = useAuth();

  const allCategories = useRef([
    {name: "SCIENCE", icon: <MdScience size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "MATH", icon: <PiMathOperationsBold size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "HISTORY", icon: <FaBook size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "LANGUAGE", icon: <IoLanguageSharp size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "TECHNOLOGY", icon: <MdComputer size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "ART", icon: <FaPaintbrush size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "BUSINESS", icon: <IoBusinessSharp size={24} className="dark:text-indigo-200 text-slate-900" />},
    {name: "OTHER", icon: <MdMiscellaneousServices size={24} className="dark:text-indigo-200 text-slate-900" />},
  ]);
  const [ categories, setCategories ] = useState([]);
  const [ studySets, setStudySets ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ ContentTitle, setContentTitle ] = useState("Popular Study Sets")
  const { pageNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);
  
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

  async function handleFilterCategory(categoryName) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_DOMAIN}/api/explore/category?filter=${categoryName}`, {
        method: "GET", 
        credentials: "include"
      });
      if(!response.ok) {
        console.error(`Error getting a response for category filter: `, response.status);
      }

      const result = await response.json();
      setStudySets(result.studySets);
      setContentTitle(categoryName.charAt(0) + categoryName.slice(1).toLocaleLowerCase());
    } catch (err) {
      console.error(`Error finding study sets from filter: `, err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(searchQuery) {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL_DOMAIN}/api/explore/result?search_query=${searchQuery}`, {
        method: "GET",
        credentials: "include",
      });
      if(!response.ok) {
        console.error(`Error getting a response for search query: `, response.status);
        return;
      }

      const result = await response.json();
      setStudySets(result.studySets);
    } catch (err) {
      console.error(`Error handling search query: `, err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFavorite(studySet) {
    setLoading(true);
    try {
      const alreadyFavorited = studySet.favoritedBy.some((userInfo) => userInfo.id === user.id);
      const query = alreadyFavorited ? "favorited=true" : "favorited=false"

      const response = await fetch(`${API_URL_DOMAIN}/api/account/${user.id}/favorite/${studySet.id}?${query}`, {
        method: "POST",
        credentials: "include",
      });
      if(!response.ok) {
        console.error(`Error getting a response for favoriting: `, response.status);
      }

      const result = await response.json();
      if(result.status == 1) {
        getCategories();
      }
      else {
        console.error("Error favoriting study set.");
      }
    } catch (err) {
      console.error(`Error favoriting study set: `, err);
    } finally {
      setLoading(false);
    }
  }

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
          className="
          dark:bg-slate-900 bg-[rgba(255,255,255,0.4)] border-none
          hover:dark:bg-slate-800 hover:bg-indigo-200 transition duration-50"
          onChange={(e) => {
            if(e.target.value.trim().length > 0) {
              handleSearch(e.target.value);
              setContentTitle(e.target.value.trim());
            } else {
              getCategories();
              setContentTitle("Popular Study Sets");
            }
          }}
          onClick={(e) => {
            if(e.target.value.trim().length === 0) {
              getCategories();
              setContentTitle("Popular Study Sets");
            }
          }}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <p
          className="font-extrabold"
        >
          Categories
        </p>
        <Carousel
          className="md:w-2xl sm:w-lg w-3xs mx-auto"
          opts={{
            align: "start",
            loop: true
          }}
        >
          <CarouselContent>
            { allCategories.current.map((category) => (
              <CarouselItem className="md:basis-1/4 sm:basis-1/3 ">
                <Card
                  className="px-3 py-1.25 flex-row items-center gap-4 w-xs/2 rounded-sm cursor-pointer select-none
                  dark:bg-slate-900 bg-[rgba(255,255,255,0.4)] border-none
                  hover:dark:bg-slate-800 hover:bg-indigo-200 duration-150"
                  onClick={() => handleFilterCategory(category.name)}
                >
                  {category.icon}
                  <CardHeader className="p-0 w-20 gap-0 h-8">
                    <CardTitle className="text-xs">
                      {category.name.charAt(0) + category.name.slice(1).toLocaleLowerCase()}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {categories[category.name] ? categories[category.name] : "0"} {categories[category.name] === 1 ? "study set" : "study sets"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </CarouselItem>
            )) }
          </CarouselContent>
          <CarouselPrevious /> 
          <CarouselNext />
        </Carousel>  
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <p className="font-extrabold">
          { ContentTitle }
        </p>
        <div className="relative grid md:grid-cols-2 grid-cols-1 gap-3">
          { loading && <LoadingOverlay className="my-24" /> }
          {!loading && studySets?.length === 0 && 
            <p className="text-center w-full absolute mt-24">
              No study sets found 
            </p>
          }
          {!loading && studySets?.map((studySet) => (
            <Card
              key={studySet.id}
              className="cursor-pointer border-none
              dark:bg-slate-900 bg-[rgba(255,255,255,0.4)]
              hover:dark:bg-slate-800 hover:bg-indigo-200 duration-150"
              onClick={() => navigate(`/study-set/${studySet.id}?explore=true`)}
            >
              <CardHeader className="gap-1">
                <CardTitle className="font-bold dark:text-indigo-100 text-slate-950 text-nowrap">
                  {studySet.name}
                </CardTitle>
                <CardDescription
                  className="dark:text-indigo-300 text-slate-900 flex flex-col gap-1"
                >
                  <p>
                    {studySet.deck.cards.length} flashcards 
                    • {studySet.quiz.attempts.length} quiz attempts
                  </p>
                  <div className="flex gap-2">
                    <p className={`w-fit px-2 rounded-xl text-xs
                      ${studySet.public ? "dark:bg-indigo-300 bg-indigo-300" : "dark:bg-slate-950 bg-indigo-900" }
                      ${studySet.public ? "dark:text-indigo-900 text-indigo-950" : "dark:text-indigo-200 text-indigo-200" }`}
                    >
                      {studySet.public ? "Public " : "Private "}
                    </p>
                    <p className={`w-fit px-2 rounded-xl text-xs
                      ${studySet.difficulty === "BEGINNER" && "dark:bg-green-900 bg-green-300 dark:text-white text-black" }
                      ${studySet.difficulty === "INTERMEDIATE" && "dark:bg-yellow-700 bg-yellow-500 dark:text-white text-black" }}
                      ${studySet.difficulty === "ADVANCED" && "dark:bg-red-900 bg-red-300 dark:text-white text-black"}`}
                    >
                      {studySet.difficulty.charAt(0) + studySet.difficulty.slice(1).toLowerCase()}
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <div 
                  className="flex gap-1 items-center justify-start text-sm font-semibold rounded-lg p-1 pr-2 
                  hover:dark:bg-slate-700 hover:bg-indigo-300 duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${studySet.userId}`);
                  }}
                >
                  <Avatar className="size-6 rounded-2xl">
                    <AvatarImage src="https://github.com/evilrabbit.png" alt="@shadcn" />
                    <AvatarFallback>Icon</AvatarFallback>
                  </Avatar>
                  <p className="truncate">
                    { studySet.user.displayName }
                  </p>
                </div>
                <p 
                  className="flex items-center gap-1 text-sm font-semibold py-1 px-2 rounded-lg
                  dark:text-indigo-100 text-indigo-950
                  hover:dark:bg-slate-700 hover:bg-indigo-300 duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(studySet);
                  }}
                >
                  { studySet.favoritedBy.some((userInfo) => userInfo.id === user.id) ? (
                    <FaHeart className="dark:text-rose-700 text-rose-400" /> 
                  ) : (
                    <FaRegHeart />
                  )}
                  {studySet.favoritedBy.length}
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