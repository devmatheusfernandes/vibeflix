import React, { useState, useEffect } from "react";
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
// NEW: Import the action to fetch details
import { fetchMovieDetails } from "@/lib/hooks/actions"; // Adjust the import path as needed

// Sample movie data for demonstration
const sampleMovie = {
  id: 1,
  title: "Inception",
  overview:
    "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea, but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.",
  posterUrl:
    "https://images.unsplash.com/photo-1489599807186-02d397f5ecaa?w=400&h=600&fit=crop",
  backdropUrl:
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop",
  releaseDate: "2010-07-16",
  rating: 8.8,
};

interface MovieDetailsModalProps {
  movie: typeof sampleMovie;
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie?: (movie: typeof sampleMovie) => void;
}

function MovieDetailsModal({
  movie,
  isOpen,
  onClose,
  onSelectMovie,
}: MovieDetailsModalProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});

  // NEW: State for cast, similar movies, and loading status
  const [cast, setCast] = useState<any[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

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
    if (isInWatchlist) {
      // Remove from watchlist
      const newWatchlist = watchlist.filter((item) => item.id !== movie.id);
      setWatchlist(newWatchlist);
      setIsInWatchlist(false);
    } else {
      // Add to watchlist
      const movieData = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        releaseDate: movie.releaseDate,
        rating: movie.rating,
      };

      const existingIndex = watchlist.findIndex((item) => item.id === movie.id);
      if (existingIndex === -1) {
        setWatchlist([...watchlist, movieData]);
      }
      setIsInWatchlist(true);
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setIsRating(true);
    setRatings((prev) => ({ ...prev, [movie.id]: rating }));

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
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`Check out ${movie.title} on VibeFlix!`);
      }
    }
  };

  // Load watchlist and rating state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsInWatchlist(watchlist.some((item) => item.id === movie.id));
      setUserRating(ratings[movie.id] || 0);
    }
  }, [isOpen, movie.id, watchlist, ratings]);

  // NEW: Fetch cast and similar movies when modal opens
  useEffect(() => {
    if (isOpen && movie.id) {
      console.log("Fetching details for movie:", movie.title, movie.id);
      const getDetails = async () => {
        setIsLoadingDetails(true);
        setCast([]);
        setSimilarMovies([]);
        try {
          const details = await fetchMovieDetails(movie.id);
          console.log("Fetched details:", details);
          setCast(details.cast || []);
          setSimilarMovies(details.similar || []);
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      getDetails();
    }
  }, [isOpen, movie.id, movie.title]); // Added movie.title to dependencies to ensure re-fetch when movie changes

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="max-h-[90vh] overflow-y-auto overflow-x-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />

            {/* Movie info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end gap-4">
                {/* Poster */}
                <div className="w-20 h-30 md:w-24 md:h-36 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
                  <img
                    src={movie.posterUrl}
                    alt={`Poster for ${movie.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x600/374151/9CA3AF?text=No+Image";
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
          <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 h-12 px-6 inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Play className="w-4 h-4" />
                Watch Now
              </button>
              <button
                onClick={handleWatchlistToggle}
                className={`h-12 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                  isInWatchlist
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                className="h-12 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Overview</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Additional details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Details</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Release Date:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(movie.releaseDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="text-gray-900 dark:text-white">
                      {movie.rating}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Movie ID:</span>
                    <span className="text-gray-900 dark:text-white">
                      #{movie.id}
                    </span>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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

            {/* Cast and Crew - NOW DYNAMIC */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoadingDetails ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="text-center animate-pulse">
                      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mx-auto mb-1"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                    </div>
                  ))
                ) : cast.length > 0 ? (
                  cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <img
                        src={
                          actor.profileUrl ||
                          `https://via.placeholder.com/185/374151/FFFFFF?text=N/A`
                        }
                        alt={actor.name}
                        className="w-16 h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-700 mx-auto mb-2"
                      />
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-500">{actor.character}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">
                    No cast information available.
                  </p>
                )}
              </div>
            </div>

            {/* Similar Movies - NOW DYNAMIC */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Similar Movies</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {isLoadingDetails ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
                    ></div>
                  ))
                ) : similarMovies.length > 0 ? (
                  similarMovies.map((similarMovie) => (
                    <button
                      key={similarMovie.id}
                      onClick={() => {
                        console.log("Similar movie clicked:", similarMovie);
                        console.log("onSelectMovie function:", onSelectMovie);
                        if (onSelectMovie) {
                          onSelectMovie(similarMovie);
                        }
                      }}
                      disabled={!onSelectMovie}
                      className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 block w-full transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:hover:scale-100 disabled:cursor-default"
                      aria-label={`View details for ${similarMovie.title}`}
                    >
                      <img
                        src={similarMovie.posterUrl}
                        alt={similarMovie.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">
                    No similar movies found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MovieDetailsModal;
