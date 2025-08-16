"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Zap,
  Drama,
  Ghost,
  Sparkles,
  Loader2,
  Shuffle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Header } from "@/app/_components/layout/header";
import { BottomNav } from "@/app/_components/layout/bottom-nav";
import PreferencesPage from "@/app/(routes)/preferences/page";
import MovieCard from "@/app/_components/ui/movie-card";

// MoodCard component
const MoodCard = ({
  Icon,
  label,
  isSelected,
  onClick,
}: {
  Icon: React.ElementType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring" as const, stiffness: 300, damping: 15 },
    },
    tap: { scale: 0.95 },
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="w-36 h-40 rounded-xl transition-all duration-300 ease-in-out border-2 flex flex-col items-center justify-center gap-4 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50">
        <div className="p-0 flex flex-col items-center justify-center gap-4">
          <Icon
            className={`w-12 h-12 transition-colors duration-300 ${
              isSelected ? "text-primary" : "text-muted-foreground"
            }`}
            strokeWidth={1.5}
          />
          <span
            className={`text-lg font-semibold transition-colors duration-300 ${
              isSelected ? "text-accent-foreground" : "text-foreground"
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// MoodSelectionPage component
const MoodSelectionPage = ({
  selectedMood,
  setSelectedMood,
  onContinue,
}: {
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  onContinue: () => void;
}) => {
  const moods = [
    { label: "Happy", Icon: Smile },
    { label: "Dramatic", Icon: Drama },
    { label: "Thrilling", Icon: Zap },
    { label: "Whimsical", Icon: Sparkles },
    { label: "Spooky", Icon: Ghost },
    { label: "Sad", Icon: Frown },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        className="text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">
          How's your vibe tonight?
        </h1>
        <p className="text-muted-foreground md:text-lg">
          Select a mood to get personalized movie suggestions.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 my-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {moods.map((mood) => (
          <motion.div
            key={mood.label}
            variants={itemVariants}
            className="flex justify-center"
          >
            <MoodCard
              Icon={mood.Icon}
              label={mood.label}
              isSelected={selectedMood === mood.label}
              onClick={() => setSelectedMood(mood.label)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <button
          disabled={!selectedMood}
          className="h-11 rounded-md px-8 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full max-w-xs"
          onClick={onContinue}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};

// SuggestionsPage component (moved to main page)
const SuggestionsPage = ({ selectedMood }: { selectedMood: string }) => {
  const mockMovies = [
    {
      id: 1,
      title: "Inception",
      overview:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq27gApcjBJUuNXa6.jpg",
    },
    {
      id: 2,
      title: "The Matrix",
      overview:
        "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/f89JxwIhLQi3r3rSCQydxkeM2sC.jpg",
    },
    {
      id: 3,
      title: "Interstellar",
      overview:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },
    {
      id: 4,
      title: "Parasite",
      overview:
        "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    },
  ];

  const [movies, setMovies] = useState<typeof mockMovies>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = () => {
    setIsLoading(true);
    console.log(`Fetching movies for mood: ${selectedMood}`);
    // In a real app, you would use the selectedMood and preferences to query the TMDb API
    setTimeout(() => {
      setMovies(
        [...mockMovies].sort(() => 0.5 - Math.random()) as typeof mockMovies
      );
      setIsLoading(false);
    }, 1500);
  };

  // Re-fetch movies if the mood changes (e.g., user goes back and picks another)
  React.useEffect(fetchMovies, [selectedMood]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        className="text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">
          Here's Your Vibe
        </h1>
        <p className="text-muted-foreground md:text-lg">
          Based on your{" "}
          <span className="text-primary font-semibold">
            {selectedMood || "choices"}
          </span>{" "}
          mood, here are a few movies you might like.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <button
              onClick={fetchMovies}
              className="h-11 rounded-md px-8 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle Vibe
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedMood) {
      setCurrentPage("/suggestions");
    } else {
      toast.error("Please select a mood first!");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "/":
        return (
          <MoodSelectionPage
            selectedMood={selectedMood || ""}
            setSelectedMood={setSelectedMood}
            onContinue={handleContinue}
          />
        );
      case "/preferences":
        return <PreferencesPage />;
      case "/suggestions":
        return <SuggestionsPage selectedMood={selectedMood || ""} />;
      default:
        return (
          <MoodSelectionPage
            selectedMood={selectedMood || ""}
            setSelectedMood={setSelectedMood}
            onContinue={handleContinue}
          />
        );
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 pb-20 md:pb-0 md:pl-20">{renderPage()}</main>
      <BottomNav activePath={currentPage} onNavigate={setCurrentPage} />
    </>
  );
}
