"use client";
import { useState } from "react";
import { BottomNav } from "./components/layout/bottom-nav";
import { Header } from "./components/layout/header";
import PreferencesPage from "./preferences/page";
import SuggestionsPage from "./suggestions/page";
import MoodSelectionPage from "./mood/page";
import WatchlistPage from "./watchlist/page";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");

  const handleNavigate = (path: string) => {
    setCurrentPage(path);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "/":
        return <MoodSelectionPage />;
      case "/preferences":
        return <PreferencesPage />;
      case "/suggestions":
        return <SuggestionsPage />;
      case "/watchlist":
        return <WatchlistPage />;
      default:
        return <MoodSelectionPage />;
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
