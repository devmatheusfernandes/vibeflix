// app/_components/ui/selectable-tag.tsx
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableTagProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

const SelectableTag: React.FC<SelectableTagProps> = ({
  label,
  isSelected,
  onToggle,
}) => (
  <motion.button
    variants={{
      hidden: { y: 10, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    }}
    onClick={onToggle}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "relative flex items-center justify-center px-4 py-2 rounded-full border transition-colors duration-200",
      isSelected
        ? "bg-primary border-primary text-primary-foreground"
        : "bg-secondary border-transparent hover:bg-accent"
    )}
  >
    {isSelected && <Check className="w-4 h-4 mr-2" />}
    {label}
  </motion.button>
);

export { SelectableTag };
