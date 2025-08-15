// app/(routes)/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Zap, Drama, Ghost, Sparkles } from "lucide-react";
import { MoodCard } from "@/app/_components/ui/mood-card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface MoodSelectionPageProps {
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  onContinue: () => void;
}

const MoodSelectionPage: React.FC<MoodSelectionPageProps> = ({
  selectedMood,
  setSelectedMood,
  onContinue,
}) => {
  const moods = [
    { label: "Happy", Icon: Smile },
    { label: "Dramatic", Icon: Drama },
    { label: "Thrilling", Icon: Zap },
    { label: "Whimsical", Icon: Sparkles },
    { label: "Spooky", Icon: Ghost },
    { label: "Sad", Icon: Frown },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        className="text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">
          How's your vibe tonight?
        </h1>
        <p className="text-muted-foreground md:text-lg">
          Select a mood to get personalized movie suggestions.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 my-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {moods.map((mood) => (
          <motion.div
            key={mood.label}
            variants={itemVariants}
            className="flex justify-center"
          >
            <MoodCard
              Icon={mood.Icon}
              label={mood.label}
              isSelected={selectedMood === mood.label}
              onClick={() => setSelectedMood(mood.label)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          size="lg"
          disabled={!selectedMood}
          className="w-full max-w-xs"
          onClick={onContinue}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default MoodSelectionPage;
