// lib/data/sample-movies.ts

export interface SampleMovie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  rating: number;
}

export const sampleMovies: SampleMovie[] = [
  {
    id: 1,
    title: "The Grand Adventure",
    overview: "A thrilling journey through uncharted territories where a group of explorers discover ancient secrets that could change the world forever. Filled with action, mystery, and breathtaking landscapes.",
    posterUrl: "https://placehold.co/400x600/211f33/9881ff?text=The+Grand+Adventure",
    backdropUrl: "https://placehold.co/1920x1080/211f33/9881ff?text=The+Grand+Adventure",
    releaseDate: "2024-03-15",
    rating: 8.5,
  },
  {
    id: 2,
    title: "Midnight Mystery",
    overview: "A gripping detective story set in a foggy coastal town where nothing is as it seems. When a local businessman disappears, a rookie detective must uncover the truth before it's too late.",
    posterUrl: "https://placehold.co/400x600/211f33/9881ff?text=Midnight+Mystery",
    backdropUrl: "https://placehold.co/1920x1080/211f33/9881ff?text=Midnight+Mystery",
    releaseDate: "2024-02-28",
    rating: 7.8,
  },
  {
    id: 3,
    title: "Cosmic Dreams",
    overview: "An animated masterpiece that takes viewers on a journey through the cosmos. When a young astronomer discovers a mysterious signal from space, she embarks on an adventure that transcends reality.",
    posterUrl: "https://placehold.co/400x600/211f33/9881ff?text=Cosmic+Dreams",
    backdropUrl: "https://placehold.co/1920x1080/211f33/9881ff?text=Cosmic+Dreams",
    releaseDate: "2024-01-10",
    rating: 9.2,
  },
  {
    id: 4,
    title: "Laugh Out Loud",
    overview: "A hilarious comedy about a stand-up comedian who accidentally becomes a viral sensation overnight. As fame takes over, he must decide what's truly important in life.",
    posterUrl: "https://placehold.co/400x600/211f33/9881ff?text=Laugh+Out+Loud",
    backdropUrl: "https://placehold.co/1920x1080/211f33/9881ff?text=Laugh+Out+Loud",
    releaseDate: "2024-04-05",
    rating: 7.5,
  },
  {
    id: 5,
    title: "Heart's Echo",
    overview: "A touching romantic drama about two people from different worlds who find love in the most unexpected place. Their journey teaches them that love knows no boundaries.",
    posterUrl: "https://placehold.co/400x600/211f33/9881ff?text=Heart's+Echo",
    backdropUrl: "https://placehold.co/1920x1080/211f33/9881ff?text=Heart's+Echo",
    releaseDate: "2024-03-22",
    rating: 8.1,
  },
  {
    id: 6,
    title: "Shadow Realm",
    overview: "A horror film that explores the dark corners of human psychology. When a group of friends investigate an abandoned asylum, they discover that some doors should never be opened.",
    posterUrl: "https://placehold.co/400x600/211f33/9881ff?text=Shadow+Realm",
    backdropUrl: "https://placehold.co/1920x1080/211f33/9881ff?text=Shadow+Realm",
    releaseDate: "2024-02-14",
    rating: 7.9,
  },
];
