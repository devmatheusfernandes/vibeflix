// app/(routes)/preferences/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Tv } from "lucide-react";
import { SelectableTag } from "@/app/_components/ui/selectable-tag";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const PreferencesPage: React.FC = () => {
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  const services = [
    "Netflix",
    "Prime Video",
    "Disney+",
    "Hulu",
    "Max",
    "Apple TV+",
  ];

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const savedPrefs = localStorage.getItem("vibeFlixPrefs");
    if (savedPrefs) {
      const { genres, services } = JSON.parse(savedPrefs);
      setSelectedGenres(genres || []);
      setSelectedServices(services || []);
    }
  }, []);

  const handleToggle = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    localStorage.setItem(
      "vibeFlixPrefs",
      JSON.stringify({ genres: selectedGenres, services: selectedServices })
    );
    toast.success("Preferences saved!");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        className="text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">
          Customize Your Experience
        </h1>
        <p className="text-muted-foreground md:text-lg">
          Tell us what you like and where you watch.
        </p>
      </motion.div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Film />
          Favorite Genres
        </h2>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {genres.map((genre) => (
            <SelectableTag
              key={genre}
              label={genre}
              isSelected={selectedGenres.includes(genre)}
              onToggle={() =>
                handleToggle(selectedGenres, setSelectedGenres, genre)
              }
            />
          ))}
        </motion.div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Tv />
          Your Services
        </h2>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {services.map((service) => (
            <SelectableTag
              key={service}
              label={service}
              isSelected={selectedServices.includes(service)}
              onToggle={() =>
                handleToggle(selectedServices, setSelectedServices, service)
              }
            />
          ))}
        </motion.div>
      </section>

      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" className="w-full max-w-xs" onClick={handleSave}>
          Save Preferences
        </Button>
      </motion.div>
    </div>
  );
};

export default PreferencesPage;
