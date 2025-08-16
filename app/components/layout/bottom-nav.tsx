// app/_components/layout/bottom-nav.tsx
import React from "react";
import { motion } from "framer-motion";
import { Home, Shuffle, Heart } from "lucide-react";

interface BottomNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export function BottomNav({ activePath, onNavigate }: BottomNavProps) {
  const navItems = [
    {
      path: "/",
      label: "Discover",
      icon: Home,
    },
    {
      path: "/random",
      label: "Random",
      icon: Shuffle,
    },
    {
      path: "/watchlist",
      label: "Watchlist",
      icon: Heart,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:left-0 md:top-0 md:bottom-0 md:w-20">
      <div className="flex h-20 w-full items-center justify-around bg-background/80 backdrop-blur-lg border-t border-border/50 md:h-full md:w-20 md:flex-col md:justify-start md:pt-20 md:border-t-0 md:border-r">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium md:hidden">
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 w-2 h-2 bg-primary rounded-full md:top-1/2 md:left-0 md:w-2 md:h-2 md:-translate-y-1/2"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
