"use client";
import { useState } from "react";
import { BottomNav } from "./components/layout/bottom-nav";
import { Header } from "./components/layout/header";
import DiscoverPage from "./discover/page";
import RandomPage from "./random/page";
import WatchlistPage from "./watchlist/page";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");

  const handleNavigate = (path: string) => {
    setCurrentPage(path);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "/":
        return <DiscoverPage />;
      case "/random":
        return <RandomPage />;
      case "/watchlist":
        return <WatchlistPage />;
      default:
        return <DiscoverPage />;
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
