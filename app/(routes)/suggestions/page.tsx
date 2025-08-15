// app/(routes)/suggestions/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Shuffle } from "lucide-react";
import { MovieCard } from "@/app/_components/ui/movie-card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const SuggestionsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedMood = searchParams.get("mood") || "adventurous";

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
  useEffect(fetchMovies, [selectedMood]);

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
            <Button size="lg" onClick={fetchMovies}>
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle Vibe
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestionsPage;
