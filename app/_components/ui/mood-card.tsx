// app/_components/ui/mood-card.tsx
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MoodCardProps {
  Icon: React.ElementType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const MoodCard: React.FC<MoodCardProps> = ({
  Icon,
  label,
  isSelected,
  onClick,
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
      <Card
        className={cn(
          "w-36 h-40 rounded-xl transition-all duration-300 ease-in-out",
          "border-2 flex flex-col items-center justify-center gap-4",
          "bg-card/50 backdrop-blur-sm",
          isSelected
            ? "border-primary ring-2 ring-primary/50 shadow-lg shadow-primary/20"
            : "border-border hover:border-primary/50"
        )}
      >
        <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
          <Icon
            className={cn(
              "w-12 h-12 transition-colors duration-300",
              isSelected ? "text-primary" : "text-muted-foreground"
            )}
            strokeWidth={1.5}
          />
          <span
            className={cn(
              "text-lg font-semibold transition-colors duration-300",
              isSelected ? "text-accent-foreground" : "text-foreground"
            )}
          >
            {label}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { MoodCard };
