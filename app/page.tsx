"use client";
import { useState, useEffect } from "react";
import { BottomNav } from "./components/layout/bottom-nav";
import { Header } from "./components/layout/header";
import PreferencesPage from "./preferences/page";
import SuggestionsPage from "./suggestions/page";
import MoodSelectionPage from "./mood/page";
import WatchlistPage from "./watchlist/page";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<{
    genres: string[];
    services: string[];
  }>({ genres: [], services: [] });

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

  const handleNavigate = (path: string) => {
    setCurrentPage(path);
  };

  const handleMoodContinue = () => {
    if (selectedMood) {
      setCurrentPage("/preferences");
    }
  };

  const handlePreferencesContinue = () => {
    setCurrentPage("/suggestions");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "/":
        return (
          <MoodSelectionPage
            selectedMood={selectedMood || ""}
            setSelectedMood={setSelectedMood}
            onContinue={handleMoodContinue}
          />
        );
      case "/preferences":
        return (
          <PreferencesPage
            onPreferencesUpdate={setPreferences}
            onContinue={handlePreferencesContinue}
            onBack={() => setCurrentPage("/")}
          />
        );
      case "/suggestions":
        return (
          <SuggestionsPage
            selectedMood={selectedMood || undefined}
            preferences={preferences}
          />
        );
      case "/watchlist":
        return <WatchlistPage />;
      default:
        return (
          <MoodSelectionPage
            selectedMood={selectedMood || ""}
            setSelectedMood={setSelectedMood}
            onContinue={handleMoodContinue}
          />
        );
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 pb-20 md:pl-20 md:pb-0">
        {renderCurrentPage()}
      </main>
      <BottomNav activePath={currentPage} onNavigate={handleNavigate} />
    </>
  );
}
