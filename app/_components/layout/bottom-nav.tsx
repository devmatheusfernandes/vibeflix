// app/_components/layout/bottom-nav.tsx
import React from "react";
import { motion } from "framer-motion";
import { Home, SlidersHorizontal, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePath, onNavigate }) => {
  const navItems = [
    { href: "/", label: "Vibe", Icon: Home },
    { href: "/preferences", label: "Preferences", Icon: SlidersHorizontal },
    { href: "/suggestions", label: "Suggestions", Icon: Film },
  ];

  const navItemVariants = {
    tap: {
      scale: 0.9,
      transition: { type: "spring" as const, stiffness: 500, damping: 30 },
    },
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-t border-border z-50 md:top-0 md:w-20 md:h-screen md:border-r md:border-t-0">
      <div className="grid h-full grid-cols-3 max-w-lg mx-auto md:flex md:flex-col md:justify-center md:h-full md:gap-4 md:max-w-none md:px-2">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = activePath === href;
          return (
            <a
              key={href}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(href);
              }}
              className="relative flex flex-col items-center justify-center h-full gap-1 p-2 transition-colors rounded-md md:h-auto hover:bg-accent"
            >
              <motion.div
                whileTap="tap"
                variants={navItemVariants}
                className="flex flex-col items-center"
              >
                <Icon
                  className={cn(
                    "w-6 h-6 mb-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={2}
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute bottom-1 h-1 w-6 rounded-full bg-primary md:left-1 md:top-1/2 md:-translate-y-1/2 md:h-6 md:w-1 md:bottom-auto"
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export { BottomNav };
