"use client";

import React, { useState, useEffect } from "react";
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
  Film,
  Tv,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import MovieCard from "../components/ui/movie-card";
import { fetchMoviesByVibe } from "@/lib/hooks/actions";

// Interface for movie data
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
}

// Interface for user preferences
interface UserPreferences {
  genres: string[];
  services: string[];
}

export default function SuggestionsPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    services: [],
  });
  const [selectedMood, setSelectedMood] = useState<string>("");

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem("vibeFlixPrefs");
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error("Error parsing preferences:", error);
      }
    }
  }, []);

  // Random moods to use when no mood is selected
  const randomMoods = ["Happy", "Dramatic", "Thrilling", "Whimsical", "Spooky"];

  // Get random mood if none selected
  const getEffectiveMood = () => {
    if (selectedMood && selectedMood.trim() !== "") {
      return selectedMood;
    }
    return randomMoods[Math.floor(Math.random() * randomMoods.length)];
  };

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);

    const effectiveMood = getEffectiveMood();
    console.log(`Fetching movies for mood: ${effectiveMood}`);

    try {
      const result = await fetchMoviesByVibe({
        mood: effectiveMood,
        preferences,
      });

      if (result.data) {
        setMovies(result.data);
        if (result.data.length === 0) {
          toast(
            "No movies found for your preferences. Try adjusting your filters!",
            {
              icon: "🎬",
            }
          );
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      const errorMessage = "Failed to fetch movies. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch movies when component mounts or mood changes
  React.useEffect(() => {
    fetchMovies();
  }, [selectedMood, preferences]);

  const displayMood = selectedMood || "Random";

  // Helper function to get mood icon
  const getMoodIcon = (mood: string) => {
    const moodIcons: { [key: string]: React.ElementType } = {
      Happy: Smile,
      Dramatic: Drama,
      Thrilling: Zap,
      Whimsical: Sparkles,
      Spooky: Ghost,
      Sad: Frown,
    };
    return moodIcons[mood] || Heart;
  };

  const MoodIcon = getMoodIcon(displayMood);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Back button */}
      <motion.button
        onClick={() => (window.location.href = "/preferences")}
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Preferences
      </motion.button>

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
          <span className="text-primary font-semibold">{displayMood}</span>{" "}
          mood, here are movies you might like.
        </p>
      </motion.div>

      {/* Criteria Display */}
      <motion.div
        className="mb-8 p-6 rounded-xl bg-card/50 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Your Selection Criteria
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mood */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MoodIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">Mood</span>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-primary font-semibold">{displayMood}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Film className="w-5 h-5 text-primary" />
              <span className="font-medium">Genres</span>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 min-h-[3rem] flex items-center justify-center">
              {preferences.genres && preferences.genres.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {preferences.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary"
                    >
                      {genre}
                    </span>
                  ))}
                  {preferences.genres.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      +{preferences.genres.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">
                  No genres selected
                </span>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Tv className="w-5 h-5 text-primary" />
              <span className="font-medium">Services</span>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 min-h-[3rem] flex items-center justify-center">
              {preferences.services && preferences.services.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {preferences.services.slice(0, 2).map((service) => (
                    <span
                      key={service}
                      className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary"
                    >
                      {service}
                    </span>
                  ))}
                  {preferences.services.length > 2 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      +{preferences.services.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">
                  No services selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {preferences.genres?.length === 0 &&
            preferences.services?.length === 0
              ? "You haven't selected any specific genres or services. We'll show you popular movies based on your mood!"
              : `Showing movies that match your ${displayMood.toLowerCase()} mood${
                  preferences.genres?.length > 0 ? ` and selected genres` : ""
                }${
                  preferences.services?.length > 0
                    ? ` and available on your streaming services`
                    : ""
                }.`}
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Frown className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg font-medium">Oops! Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <button
            onClick={fetchMovies}
            className="h-11 rounded-md px-8 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Ghost className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg font-medium">No movies found</p>
            <p className="text-sm mt-1">
              Try adjusting your preferences or shuffle for new results
            </p>
          </div>
          <button
            onClick={fetchMovies}
            className="h-11 rounded-md px-8 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Shuffle Vibe
          </button>
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
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <MovieCard {...movie} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {/* Floating Shuffle Button */}
      <motion.button
        onClick={fetchMovies}
        disabled={isLoading}
        className="fixed bottom-18 right-6 z-40 h-14 w-14 rounded-full bg-secondary-foreground text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Shuffle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
