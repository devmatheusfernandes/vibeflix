// lib/hooks/actions.ts
"use server";

import { sampleMovies } from "../data/sample-movies";

// Interface for user preferences
interface UserPreferences {
  genres: string[];
  services: string[];
}

// Interface for the data sent to the action
interface FetchMoviesProps {
  mood: string;
  preferences: UserPreferences;
}

// Mappings from user-friendly names to TMDb IDs
const moodToGenreMap: { [key: string]: string } = {
  Happy: "35,10751", // Comedy, Family
  Dramatic: "18", // Drama
  Thrilling: "28,53", // Action, Thriller
  Whimsical: "14,16", // Fantasy, Animation
  Spooky: "27,9648", // Horror, Mystery
  Sad: "18,10749", // Drama, Romance
};

const genreNameToIdMap: { [key: string]: string } = {
  Action: "28", Adventure: "12", Animation: "16", Comedy: "35", Crime: "80",
  Documentary: "99", Drama: "18", Family: "10751", Fantasy: "14", History: "36",
  Horror: "27", Music: "10402", Mystery: "9648", Romance: "10749", "Sci-Fi": "878",
  Thriller: "53", War: "10752", Western: "37",
};

const serviceNameToIdMap: { [key: string]: string } = {
  "Netflix": "8", "Prime Video": "9", "Disney+": "337", "Hulu": "15", "Max": "1899", "Apple TV+": "350",
};

export async function fetchMoviesByVibe({ mood, preferences }: FetchMoviesProps) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    // Return sample data if no API key is configured
    console.log("No API key configured, using sample data");
    return { data: sampleMovies };
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      language: "en-US",
      sort_by: "popularity.desc",
      include_adult: "false",
      'vote_count.gte': '200' // Get reasonably well-known movies
    });

    // 1. Combine mood genres and preference genres
    const moodGenreIds = moodToGenreMap[mood] ? moodToGenreMap[mood].split(',') : [];
    const preferenceGenreIds = preferences.genres.map(g => genreNameToIdMap[g]).filter(Boolean);
    const allGenreIds = [...new Set([...moodGenreIds, ...preferenceGenreIds])];
    if (allGenreIds.length > 0) {
      params.append('with_genres', allGenreIds.join(','));
    }

    // 2. Add watch providers if any are selected
    const providerIds = preferences.services.map(s => serviceNameToIdMap[s]).filter(Boolean);
    if (providerIds.length > 0) {
      params.append('with_watch_providers', providerIds.join('|')); // '|' means OR
      params.append('watch_region', 'BR'); // Specify Brazil as the region
    }

    const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("TMDb API Error:", await response.text());
      // Fallback to sample data if API fails
      console.log("API failed, using sample data as fallback");
      return { data: sampleMovies };
    }

    const data = await response.json();

    // 3. Format the data for our MovieCard component with all required properties
    const formattedMovies = data.results.slice(0, 12).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview || "No overview available.",
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/400x600/211f33/9881ff?text=VibeFlix",
      backdropUrl: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "https://placehold.co/1920x1080/211f33/9881ff?text=VibeFlix",
      releaseDate: movie.release_date || "Unknown",
      rating: movie.vote_average || 0,
    }));

    return { data: formattedMovies };

  } catch (error) {
    console.error("Fetch Error:", error);
    // Fallback to sample data if any error occurs
    console.log("Error occurred, using sample data as fallback");
    return { data: sampleMovies };
  }
}