// app/_components/ui/movie-card.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MovieDetailsModal } from "./movie-details-modal";

interface MovieCardProps {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  overview,
  posterUrl,
  backdropUrl,
  releaseDate,
  rating,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div variants={cardVariants}>
        <div className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-border/50 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
          <div className="p-0">
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
          </div>
          <div className="p-4">
            <h3 className="mb-2 line-clamp-1 text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {overview}
            </p>
          </div>
          <div className="p-4 pt-0">
            <button
              onClick={handleViewDetails}
              className="w-full h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      <MovieDetailsModal
        movie={{
          id,
          title,
          overview,
          posterUrl,
          backdropUrl,
          releaseDate,
          rating,
        }}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default MovieCard;
