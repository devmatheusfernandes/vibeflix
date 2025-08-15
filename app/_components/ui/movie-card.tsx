// app/_components/ui/movie-card.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  title: string;
  overview: string;
  posterUrl: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  overview,
  posterUrl,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-border/50 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="p-0">
          <div className="aspect-[2/3] w-full">
            <img
              src={posterUrl}
              alt={`Poster for ${title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/400x600/211f33/9881ff?text=VibeFlix";
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="mb-2 line-clamp-1 text-lg">{title}</CardTitle>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {overview}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full">View Details</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { MovieCard };
