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
const moodToGenreMap: { [key:string]: string } = {
  Happy: "35,10751", // Comedy, Family
  Dramatic: "18", // Drama
  Thrilling: "28,53", // Action, Thriller
  Whimsical: "14,16", // Fantasy, Animation
  Spooky: "27,9648", // Horror, Mystery
  Sad: "18,10749", // Drama, Romance
};

const genreNameToIdMap: { [key:string]: string } = {
  Action: "28", Adventure: "12", Animation: "16", Comedy: "35", Crime: "80",
  Documentary: "99", Drama: "18", Family: "10751", Fantasy: "14", History: "36",
  Horror: "27", Music: "10402", Mystery: "9648", Romance: "10749", "Sci-Fi": "878",
  Thriller: "53", War: "10752", Western: "37",
};

const serviceNameToIdMap: { [key:string]: string } = {
  "Netflix": "8", "Prime Video": "9", "Disney+": "337", "Hulu": "15", "Max": "1899", "Apple TV+": "350",
};

export async function fetchMoviesByVibe({ mood, preferences }: FetchMoviesProps) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.log("No API key configured, using sample data");
    return { data: sampleMovies };
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      language: "en-US",
      sort_by: "popularity.desc",
      include_adult: "false",
      'vote_count.gte': '200'
    });

    const moodGenreIds = moodToGenreMap[mood] ? moodToGenreMap[mood].split(',') : [];
    const preferenceGenreIds = preferences.genres.map(g => genreNameToIdMap[g]).filter(Boolean);
    const allGenreIds = [...new Set([...moodGenreIds, ...preferenceGenreIds])];
    if (allGenreIds.length > 0) {
      params.append('with_genres', allGenreIds.join(','));
    }

    const providerIds = preferences.services.map(s => serviceNameToIdMap[s]).filter(Boolean);
    if (providerIds.length > 0) {
      params.append('with_watch_providers', providerIds.join('|'));
      params.append('watch_region', 'BR');
    }

    const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("TMDb API Error:", await response.text());
      return { data: sampleMovies };
    }

    const data = await response.json();

    const formattedMovies = data.results.slice(0, 12).map((movie:any) => ({
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
    return { data: sampleMovies };
  }
}

/**
 * Fetches additional details for a specific movie, like cast, similar movies, director, and runtime.
 */
export async function fetchMovieDetails(movieId: number) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const emptyDetails = { director: "N/A", runtime: 0 };
  if (!apiKey) {
    console.log("No API key configured, returning empty details");
    return { cast: [], similar: [], details: emptyDetails };
  }

  const baseUrl = 'https://api.themoviedb.org/3/movie/';
  const params = new URLSearchParams({
    api_key: apiKey,
    language: "en-US",
  });

  try {
    // Fetch credits, similar movies, and main details in parallel
    const [creditsResponse, similarResponse, detailsResponse] = await Promise.all([
      fetch(`${baseUrl}${movieId}/credits?${params.toString()}`),
      fetch(`${baseUrl}${movieId}/similar?${params.toString()}`),
      fetch(`${baseUrl}${movieId}?${params.toString()}`), // <-- NEW API CALL
    ]);

    if (!creditsResponse.ok || !similarResponse.ok || !detailsResponse.ok) {
      console.error("TMDb API Error fetching details for movie:", movieId);
      throw new Error('Failed to fetch movie details');
    }

    const creditsData = await creditsResponse.json();
    const similarData = await similarResponse.json();
    const detailsData = await detailsResponse.json(); // <-- NEW DATA

    const formattedCast = creditsData.cast.slice(0, 4).map((person: any) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profileUrl: person.profile_path
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : null,
    }));

    const formattedSimilar = similarData.results.slice(0, 6).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview || "No overview available.",
      posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://placehold.co/400x600/211f33/9881ff?text=VibeFlix",
      backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      releaseDate: movie.release_date || "Unknown",
      rating: movie.vote_average || 0,
    }));

    // NEW: Extract director from crew and runtime from main details
    const director = creditsData.crew.find((person: any) => person.job === 'Director')?.name || 'N/A';
    const runtime = detailsData.runtime || 0;
    
    return { 
      cast: formattedCast, 
      similar: formattedSimilar, 
      details: { director, runtime } 
    };

  } catch (error) {
    console.error("Fetch Movie Details Error:", error);
    return { cast: [], similar: [], details: emptyDetails };
  }
}