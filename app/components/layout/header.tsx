// app/_components/layout/header.tsx
import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { ThemeToggle } from "../ui/theme-toggle";

const Header: React.FC = () => (
  <header
    className={cn(
      "fixed top-0 left-0 right-0 h-16 z-40",
      "flex items-center",
      "bg-card/80 backdrop-blur-lg border-b border-border",
      "md:pl-20"
    )}
  >
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground tracking-tighter">
            VibeFlix
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </div>
  </header>
);

export { Header };
