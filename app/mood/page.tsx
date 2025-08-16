"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Zap, Drama, Ghost, Sparkles } from "lucide-react";

// MoodCard component
const MoodCard = ({
  Icon,
  label,
  isSelected,
  onClick,
}: {
  Icon: React.ElementType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring" as const, stiffness: 300, damping: 15 },
    },
    tap: { scale: 0.95 },
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className={`w-36 h-40 rounded-xl transition-all duration-300 ease-in-out border-2 flex flex-col items-center justify-center gap-4 bg-card/50 backdrop-blur-sm hover:border-primary/50 ${
          isSelected
            ? "border-primary shadow-lg shadow-primary/20"
            : "border-border"
        }`}
      >
        <div className="p-0 flex flex-col items-center justify-center gap-4">
          <Icon
            className={`w-12 h-12 transition-colors duration-300 ${
              isSelected ? "text-primary" : "text-muted-foreground"
            }`}
            strokeWidth={1.5}
          />
          <span
            className={`text-lg font-semibold transition-colors duration-300 ${
              isSelected ? "text-primary" : "text-foreground"
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// MoodSelectionPage component - now compatible with Next.js page requirements
export default function MoodSelectionPage() {
  const [selectedMood, setSelectedMood] = useState<string>("");

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

  const handleContinue = () => {
    if (selectedMood) {
      // Navigate to preferences page
      window.location.href = "/preferences";
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        className="text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          How are you feeling today?
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose a mood and we'll curate the perfect movie experience just for
          you
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-6 mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {moods.map((mood) => (
          <motion.div key={mood.label} variants={itemVariants}>
            <MoodCard
              Icon={mood.Icon}
              label={mood.label}
              isSelected={selectedMood === mood.label}
              onClick={() => setSelectedMood(mood.label)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Continue button - only appears when a mood is selected */}
      {selectedMood && (
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleContinue}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            Continue to Preferences
          </button>
        </motion.div>
      )}
    </div>
  );
}
