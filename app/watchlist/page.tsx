"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Trash2,
  Heart,
  Calendar,
  Star,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import MovieCard from "../components/ui/movie-card";
import { sampleMovies } from "@/lib/data/sample-movies";

interface WatchlistMovie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
}

export default function WatchlistPage() {
  const [watchlistMovies, setWatchlistMovies] = useState<WatchlistMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Load watchlist from localStorage
  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    try {
      const watchlistData = JSON.parse(
        localStorage.getItem("vibeFlixWatchlist") || "[]"
      );

      console.log("Watchlist data from localStorage:", watchlistData);

      // Check if the data structure has changed
      if (watchlistData.length === 0) {
        setWatchlistMovies([]);
        setDebugInfo("Watchlist is empty");
        setIsLoading(false);
        return;
      }

      // Check if we have the new structure (complete movie objects) or old structure (just IDs)
      const isNewStructure =
        typeof watchlistData[0] === "object" &&
        watchlistData[0].hasOwnProperty("title");

      if (isNewStructure) {
        // New structure: complete movie objects
        console.log("Using new watchlist structure (complete movie objects)");
        setWatchlistMovies(watchlistData);
        setDebugInfo(
          `Found ${watchlistData.length} movies: ${watchlistData
            .map((m: any) => m.title)
            .join(", ")}`
        );
      } else {
        // Old structure: just IDs - convert to new structure using available movies
        console.log(
          "Converting old watchlist structure (IDs) to new structure"
        );
        const watchlistIds = watchlistData;

        // Create a comprehensive list of available movies
        // In a real app, you'd fetch these from an API using the IDs
        const allAvailableMovies = [
          ...sampleMovies,
          // Additional movies with different ID ranges
          {
            id: 101,
            title: "Action Hero",
            overview:
              "A thrilling action movie with amazing stunts and explosions.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Action+Hero",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Action+Hero",
            releaseDate: "2024-05-01",
            rating: 8.0,
          },
          {
            id: 102,
            title: "Comedy Central",
            overview:
              "A hilarious comedy that will make you laugh until you cry.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Comedy+Central",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Comedy+Central",
            releaseDate: "2024-04-15",
            rating: 7.8,
          },
          {
            id: 103,
            title: "Drama Queen",
            overview:
              "An emotional drama that explores the depths of human relationships.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Drama+Queen",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Drama+Queen",
            releaseDate: "2024-03-20",
            rating: 8.2,
          },
          {
            id: 104,
            title: "Sci-Fi Adventure",
            overview:
              "A futuristic sci-fi movie that takes you to another dimension.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Sci-Fi+Adventure",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Sci-Fi+Adventure",
            releaseDate: "2024-02-10",
            rating: 8.7,
          },
          {
            id: 105,
            title: "Horror Night",
            overview: "A spine-chilling horror movie that will keep you awake.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Horror+Night",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Horror+Night",
            releaseDate: "2024-01-25",
            rating: 7.5,
          },
          // Add more movies with different ID ranges that might come from suggestions
          {
            id: 201,
            title: "Romantic Comedy",
            overview:
              "A sweet romantic comedy about finding love in unexpected places.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Romantic+Comedy",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Romantic+Comedy",
            releaseDate: "2024-06-01",
            rating: 7.9,
          },
          {
            id: 202,
            title: "Thriller Edge",
            overview:
              "A gripping thriller that will keep you on the edge of your seat.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Thriller+Edge",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Thriller+Edge",
            releaseDate: "2024-05-15",
            rating: 8.3,
          },
          {
            id: 203,
            title: "Fantasy World",
            overview: "An epic fantasy adventure in a magical world.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Fantasy+World",
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Fantasy+World",
            releaseDate: "2024-04-20",
            rating: 8.1,
          },
        ];

        // Filter to only show movies that are in the watchlist
        const filteredMovies = allAvailableMovies.filter((movie) =>
          watchlistIds.includes(movie.id)
        );

        console.log(
          "Available movies:",
          allAvailableMovies.map((m) => ({ id: m.id, title: m.title }))
        );
        console.log("Filtered movies for watchlist:", filteredMovies);

        setWatchlistMovies(filteredMovies);

        // Show debug info about what was found
        if (filteredMovies.length === 0) {
          setDebugInfo(
            `Watchlist IDs: [${watchlistIds.join(
              ", "
            )}] - No movies found with these IDs`
          );
        } else {
          setDebugInfo(
            `Found ${filteredMovies.length} movies: ${filteredMovies
              .map((m) => m.title)
              .join(", ")}`
          );
        }
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
      toast.error("Failed to load watchlist");
      setDebugInfo(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    try {
      const watchlist = JSON.parse(
        localStorage.getItem("vibeFlixWatchlist") || "[]"
      );

      // Handle both old structure (IDs) and new structure (complete objects)
      const isNewStructure =
        watchlist.length > 0 &&
        typeof watchlist[0] === "object" &&
        watchlist[0].hasOwnProperty("title");

      if (isNewStructure) {
        // New structure: filter out the movie object
        const newWatchlist = watchlist.filter(
          (item: any) => item.id !== movieId
        );
        localStorage.setItem("vibeFlixWatchlist", JSON.stringify(newWatchlist));
      } else {
        // Old structure: filter out the ID
        const newWatchlist = watchlist.filter((id: number) => id !== movieId);
        localStorage.setItem("vibeFlixWatchlist", JSON.stringify(newWatchlist));
      }

      setWatchlistMovies((prev) =>
        prev.filter((movie) => movie.id !== movieId)
      );
      toast.success("Removed from watchlist");

      // Update debug info
      loadWatchlist();
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("Failed to remove from watchlist");
    }
  };

  const clearWatchlist = () => {
    try {
      localStorage.setItem("vibeFlixWatchlist", JSON.stringify([]));
      setWatchlistMovies([]);
      setDebugInfo("Watchlist cleared");
      toast.success("Watchlist cleared");
    } catch (error) {
      console.error("Error clearing watchlist:", error);
      toast.error("Failed to clear watchlist");
    }
  };

  // Add a test function to add some movies to watchlist for testing
  const addTestMovies = () => {
    try {
      // Add test movies using the new structure (complete objects)
      const testMovies = [
        {
          id: 1,
          title: "The Grand Adventure",
          overview:
            "A thrilling journey through uncharted territories with action, mystery, and breathtaking landscapes.",
          posterUrl:
            "https://placehold.co/400x600/211f33/9881ff?text=The+Grand+Adventure",
          backdropUrl:
            "https://placehold.co/1920x1080/211f33/9881ff?text=The+Grand+Adventure",
          releaseDate: "2024-01-15",
          rating: 8.5,
        },
        {
          id: 101,
          title: "Action Hero",
          overview:
            "A thrilling action movie with amazing stunts and explosions.",
          posterUrl:
            "https://placehold.co/400x600/211f33/9881ff?text=Action+Hero",
          backdropUrl:
            "https://placehold.co/1920x1080/211f33/9881ff?text=Action+Hero",
          releaseDate: "2024-05-01",
          rating: 8.0,
        },
        {
          id: 201,
          title: "Romantic Comedy",
          overview:
            "A sweet romantic comedy about finding love in unexpected places.",
          posterUrl:
            "https://placehold.co/400x600/211f33/9881ff?text=Romantic+Comedy",
          backdropUrl:
            "https://placehold.co/1920x1080/211f33/9881ff?text=Romantic+Comedy",
          releaseDate: "2024-06-01",
          rating: 7.9,
        },
      ];

      localStorage.setItem("vibeFlixWatchlist", JSON.stringify(testMovies));
      loadWatchlist(); // Reload the watchlist
      toast.success("Added test movies to watchlist");
    } catch (error) {
      console.error("Error adding test movies:", error);
      toast.error("Failed to add test movies");
    }
  };

  // Function to manually add a movie by ID
  const addMovieById = () => {
    const movieId = prompt("Enter movie ID to add to watchlist:");
    if (movieId && !isNaN(Number(movieId))) {
      try {
        const watchlist = JSON.parse(
          localStorage.getItem("vibeFlixWatchlist") || "[]"
        );

        // Check if movie is already in watchlist (by ID)
        const existingIndex = watchlist.findIndex((item: any) =>
          typeof item === "object"
            ? item.id === Number(movieId)
            : item === Number(movieId)
        );

        if (existingIndex === -1) {
          // Create a placeholder movie object for the ID
          const placeholderMovie = {
            id: Number(movieId),
            title: `Movie ID ${movieId}`,
            overview:
              "This movie was added by ID. Full details will be available when viewing from suggestions.",
            posterUrl:
              "https://placehold.co/400x600/211f33/9881ff?text=Movie+" +
              movieId,
            backdropUrl:
              "https://placehold.co/1920x1080/211f33/9881ff?text=Movie+" +
              movieId,
            releaseDate: "Unknown",
            rating: 0,
          };

          watchlist.push(placeholderMovie);
          localStorage.setItem("vibeFlixWatchlist", JSON.stringify(watchlist));
          loadWatchlist();
          toast.success(`Added movie ID ${movieId} to watchlist`);
        } else {
          toast(`Movie ID ${movieId} is already in watchlist`, { icon: "ℹ️" });
        }
      } catch (error) {
        console.error("Error adding movie by ID:", error);
        toast.error("Failed to add movie");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        className="text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bookmark className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            My Watchlist
          </h1>
        </div>
        <p className="text-muted-foreground md:text-lg">
          {watchlistMovies.length === 0
            ? "Your watchlist is empty. Start adding movies you'd like to watch!"
            : `You have ${watchlistMovies.length} movie${
                watchlistMovies.length === 1 ? "" : "s"
              } in your watchlist.`}
        </p>
      </motion.div>

      {watchlistMovies.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Bookmark className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No movies yet</h3>
          <p className="text-muted-foreground mb-6">
            Browse movies and add them to your watchlist to see them here
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Movies
            </button>
            <br />
          </div>
        </motion.div>
      ) : (
        <>
          {/* Watchlist actions */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {watchlistMovies.length} movie
                {watchlistMovies.length === 1 ? "" : "s"}
              </span>
            </div>
            <button
              onClick={clearWatchlist}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </motion.div>

          {/* Movies grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {watchlistMovies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="relative group"
              >
                <MovieCard {...movie} />

                {/* Remove button overlay */}
                <motion.button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty state after clearing */}
          {watchlistMovies.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Bookmark className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Watchlist cleared</h3>
              <p className="text-muted-foreground mb-6">
                Your watchlist has been cleared. Start fresh by adding new
                movies!
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
