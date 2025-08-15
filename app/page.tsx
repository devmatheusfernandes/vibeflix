// app/(routes)/app.tsx
"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Header } from "@/app/_components/layout/header";
import { BottomNav } from "@/app/_components/layout/bottom-nav";
import MoodSelectionPage from "@/app/(routes)/page";
import PreferencesPage from "@/app/(routes)/preferences/page";
import SuggestionsPage from "@/app/(routes)/suggestions/page";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedMood) {
      setCurrentPage("/suggestions");
    } else {
      toast.error("Please select a mood first!");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "/":
        return (
          <MoodSelectionPage
            selectedMood={selectedMood || ""}
            setSelectedMood={setSelectedMood}
            onContinue={handleContinue}
          />
        );
      case "/preferences":
        return <PreferencesPage />;
      case "/suggestions":
        return <SuggestionsPage />;
      default:
        return (
          <MoodSelectionPage
            selectedMood={selectedMood || ""}
            setSelectedMood={setSelectedMood}
            onContinue={handleContinue}
          />
        );
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 pb-20 md:pb-0 md:pl-20">{renderPage()}</main>
      <BottomNav activePath={currentPage} onNavigate={setCurrentPage} />
    </>
  );
}
