"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Shuffle, Film, Tv } from "lucide-react";
import { toast } from "react-hot-toast";
import MovieCard from "../components/ui/movie-card";
import { fetchMoviesByVibe } from "@/lib/hooks/actions";

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
}

interface UserPreferences {
  genres: string[];
  services: string[];
}

export default function RandomPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    services: [],
  });
  const [selectedMood, setSelectedMood] = useState<string>("");

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

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem("vibeFlixPrefs");
    const savedMood = localStorage.getItem("vibeFlixMood");

    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error("Error parsing preferences:", error);
      }
    }

    if (savedMood) {
      setSelectedMood(savedMood);
    }

    fetchMovies();
  }, []);

  const displayMood = selectedMood || getEffectiveMood();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Random Movie Suggestions
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover new films based on your mood and preferences
          </p>
        </motion.div>

        {/* Mood and Preferences Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Mood */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Film className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Current Mood</h3>
              <p className="text-2xl font-bold text-primary">{displayMood}</p>
            </div>

            {/* Preferences Summary */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center">
                <Tv className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your Preferences</h3>
              <div className="space-y-1">
                {preferences.genres.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {preferences.genres.slice(0, 3).join(", ")}
                    {preferences.genres.length > 3 && "..."}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No specific genres
                  </p>
                )}
                {preferences.services.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Available on: {preferences.services.slice(0, 2).join(", ")}
                    {preferences.services.length > 2 && "..."}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    All streaming services
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
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
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-red-500 mb-4">
              <Film className="w-16 h-16 mx-auto mb-2" />
              <p className="text-lg font-medium">Oops! Something went wrong</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <button
              onClick={fetchMovies}
              className="h-11 rounded-md px-8 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
          </motion.div>
        ) : movies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground mb-4">
              <Film className="w-16 h-16 mx-auto mb-2" />
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
          </motion.div>
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
    </div>
  );
}
