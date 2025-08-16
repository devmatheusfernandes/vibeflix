"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  Frown,
  Zap,
  Drama,
  Ghost,
  Sparkles,
  Film,
  Tv,
  ArrowRight,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchMoviesByVibe } from "@/lib/hooks/actions";

// NEW: Import the MovieDetailsModal component
import MovieDetailsModal from "../components/ui/movie-details-modal"; // Adjust the import path if necessary

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

type DiscoveryStep = "initial" | "mood" | "preferences" | "suggestions";

export default function DiscoverPage() {
  const [currentStep, setCurrentStep] = useState<DiscoveryStep>("initial");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    services: [],
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: State for managing the movie details modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []);

  const moods = [
    { label: "Happy", Icon: Smile, color: "from-yellow-400 to-orange-400" },
    { label: "Dramatic", Icon: Drama, color: "from-purple-400 to-pink-400" },
    { label: "Thrilling", Icon: Zap, color: "from-blue-400 to-cyan-400" },
    {
      label: "Whimsical",
      Icon: Sparkles,
      color: "from-pink-400 to-purple-400",
    },
    { label: "Spooky", Icon: Ghost, color: "from-gray-600 to-gray-800" },
    { label: "Sad", Icon: Frown, color: "from-blue-500 to-indigo-500" },
  ];

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  const services = [
    "Netflix",
    "Prime Video",
    "Disney+",
    "Hulu",
    "Max",
    "Apple TV+",
  ];

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    localStorage.setItem("vibeFlixMood", mood);
    setCurrentStep("preferences");
  };

  const handleGenreToggle = (genre: string) => {
    const newPreferences = {
      ...preferences,
      genres: preferences.genres.includes(genre)
        ? preferences.genres.filter((g) => g !== genre)
        : [...preferences.genres, genre],
    };
    setPreferences(newPreferences);
    localStorage.setItem("vibeFlixPrefs", JSON.stringify(newPreferences));
  };

  const handleServiceToggle = (service: string) => {
    const newPreferences = {
      ...preferences,
      services: preferences.services.includes(service)
        ? preferences.services.filter((s) => s !== service)
        : [...preferences.services, service],
    };
    setPreferences(newPreferences);
    localStorage.setItem("vibeFlixPrefs", JSON.stringify(newPreferences));
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    try {
      const result = await fetchMoviesByVibe({
        mood: selectedMood,
        preferences,
      });

      if (result.data && result.data.length > 0) {
        setMovies(result.data);
        setCurrentStep("suggestions");
        toast.success(`Found ${result.data.length} movies for you!`);
      } else {
        toast.error("No movies found. Try adjusting your preferences!");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep("initial");
    setSelectedMood("");
    setPreferences({ genres: [], services: [] });
    setMovies([]);
  };

  // NEW: Handlers for opening and closing the modal
  const handleViewDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Your Perfect Movie
          </h1>
          <p className="text-muted-foreground mt-2">
            Let us find the perfect film for your mood and preferences
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl"
          >
            {/* Initial Step */}
            {currentStep === "initial" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Ready to Discover?</h2>
                <p className="text-muted-foreground mb-8">
                  We'll help you find the perfect movie based on your mood and
                  preferences
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep("mood")}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Discovery
                </motion.button>
              </motion.div>
            )}

            {/* Mood Selection Step */}
            {currentStep === "mood" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    How are you feeling today?
                  </h2>
                  <p className="text-muted-foreground">
                    Choose a mood that matches your vibe
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(mood.label)}
                      className="p-6 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all duration-200 bg-card/50 hover:bg-card/80"
                    >
                      <div
                        className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${mood.color} rounded-full flex items-center justify-center`}
                      >
                        <mood.Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="font-medium">{mood.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep("initial")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Preferences Step */}
            {currentStep === "preferences" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    Customize Your Experience
                  </h2>
                  <p className="text-muted-foreground">
                    Select your favorite genres and streaming services
                    (optional)
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Genres */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Film className="w-5 h-5" />
                      Favorite Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <motion.button
                          key={genre}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGenreToggle(genre)}
                          className={`p-2 text-sm rounded-lg border transition-all ${
                            preferences.genres.includes(genre)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          {genre}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Streaming Services */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Tv className="w-5 h-5" />
                      Streaming Services
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <motion.button
                          key={service}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleServiceToggle(service)}
                          className={`p-3 text-sm rounded-lg border transition-all ${
                            preferences.services.includes(service)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          {service}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep("mood")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetSuggestions}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finding Movies...
                      </>
                    ) : (
                      <>
                        Surprise Me!
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Suggestions Step */}
            {currentStep === "suggestions" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    Your Movie Suggestions
                  </h2>
                  <p className="text-muted-foreground">
                    Based on your {selectedMood.toLowerCase()} mood and
                    preferences
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 my-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Vibe:</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {selectedMood}
                    </span>
                  </div>

                  {preferences.genres.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 max-w-lg">
                      <span className="font-semibold text-foreground self-start">
                        Genres:
                      </span>
                      {preferences.genres.map((genre) => (
                        <span
                          key={genre}
                          className="bg-muted px-2 py-1 rounded-md text-muted-foreground text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {preferences.services.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 max-w-lg">
                      <span className="font-semibold text-foreground self-start">
                        Services:
                      </span>
                      {preferences.services.map((service) => (
                        <span
                          key={service}
                          className="bg-muted px-2 py-1 rounded-md text-muted-foreground text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-card/50 rounded-lg overflow-hidden border border-border/30 flex flex-col group"
                    >
                      <div className="aspect-[2/3] relative">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="text-sm font-semibold text-white line-clamp-1">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-1 mt-1 text-xs text-yellow-400">
                            <span>★</span>
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      {/* NEW: View Details Button */}
                      <div className="p-2 mt-auto">
                        <button
                          onClick={() => handleViewDetails(movie)}
                          className="w-full bg-primary/80 text-primary-foreground text-xs font-semibold py-2 rounded-md hover:bg-primary transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep("preferences")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Preferences
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Start Over
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NEW: Render the MovieDetailsModal */}
      {isModalOpen && selectedMovie && (
        <MovieDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          movie={selectedMovie}
          onSelectMovie={(newMovie) => setSelectedMovie(newMovie)}
        />
      )}
    </div>
  );
}
