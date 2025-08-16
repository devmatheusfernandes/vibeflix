"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Calendar,
  Play,
  Heart,
  Share2,
  Plus,
  Check,
} from "lucide-react";

interface MovieDetailsModalProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    posterUrl: string;
    backdropUrl: string;
    releaseDate: string;
    rating: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDetailsModal({
  movie,
  isOpen,
  onClose,
}: MovieDetailsModalProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  };

  const formatDate = (dateString: string) => {
    if (dateString === "Unknown") return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);

    // Save complete movie data to localStorage instead of just the ID
    const watchlist = JSON.parse(
      localStorage.getItem("vibeFlixWatchlist") || "[]"
    );

    if (isInWatchlist) {
      // Remove movie from watchlist
      const newWatchlist = watchlist.filter(
        (item: any) => item.id !== movie.id
      );
      localStorage.setItem("vibeFlixWatchlist", JSON.stringify(newWatchlist));
    } else {
      // Add complete movie data to watchlist
      const movieData = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        releaseDate: movie.releaseDate,
        rating: movie.rating,
      };

      // Check if movie is already in watchlist (by ID)
      const existingIndex = watchlist.findIndex(
        (item: any) => item.id === movie.id
      );
      if (existingIndex === -1) {
        watchlist.push(movieData);
      } else {
        // Update existing entry
        watchlist[existingIndex] = movieData;
      }

      localStorage.setItem("vibeFlixWatchlist", JSON.stringify(watchlist));
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setIsRating(true);
    // Save rating to localStorage
    const ratings = JSON.parse(localStorage.getItem("vibeFlixRatings") || "{}");
    ratings[movie.id] = rating;
    localStorage.setItem("vibeFlixRatings", JSON.stringify(ratings));

    // Reset rating state after a delay
    setTimeout(() => setIsRating(false), 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on VibeFlix!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Check out ${movie.title} on VibeFlix!`);
    }
  };

  // Load watchlist and rating state from localStorage
  React.useEffect(() => {
    if (isOpen) {
      const watchlist = JSON.parse(
        localStorage.getItem("vibeFlixWatchlist") || "[]"
      );
      setIsInWatchlist(watchlist.some((item: any) => item.id === movie.id));

      const ratings = JSON.parse(
        localStorage.getItem("vibeFlixRatings") || "{}"
      );
      setUserRating(ratings[movie.id] || 0);
    }
  }, [isOpen, movie.id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero section with backdrop */}
            <div className="relative h-64 md:h-80">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={`Backdrop for ${movie.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = movie.posterUrl;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

              {/* Movie info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end gap-4">
                  {/* Poster */}
                  <div className="w-20 h-30 md:w-24 md:h-36 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                    <img
                      src={movie.posterUrl}
                      alt={`Poster for ${movie.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/400x600/211f33/9881ff?text=VibeFlix";
                      }}
                    />
                  </div>

                  {/* Title and basic info */}
                  <div className="flex-1 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      {movie.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        {renderStars(movie.rating)}
                        <span className="ml-1">{movie.rating}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(movie.releaseDate)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="p-6">
              {/* Action buttons */}
              <div className="flex gap-3 mb-6">
                <button className="flex-1 h-12 px-6 inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Play className="w-4 h-4" />
                  Watch Now
                </button>
                <button
                  onClick={handleWatchlistToggle}
                  className={`h-12 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                    isInWatchlist
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {isInWatchlist ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="h-12 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium border border-border bg-background hover:bg-accent transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Additional details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Release Date:</span>
                      <span className="text-foreground">
                        {formatDate(movie.releaseDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="text-foreground">{movie.rating}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Movie ID:</span>
                      <span className="text-foreground">#{movie.id}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Rating</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star * 2)}
                          className={`p-1 rounded transition-colors ${
                            userRating >= star * 2
                              ? "text-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              userRating >= star * 2 ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <p className="text-sm text-muted-foreground">
                        You rated this movie {userRating}/10
                      </p>
                    )}
                    {isRating && (
                      <p className="text-sm text-green-600 font-medium">
                        Rating saved!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
