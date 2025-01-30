interface CarouselDotsProps {
  count: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export const CarouselDots = ({
  count,
  currentIndex,
  onDotClick,
}: CarouselDotsProps) => (
  <div className="flex justify-center gap-1 py-2">
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        className={`h-2 rounded-full transition-all sm:h-3 ${
          index === currentIndex
            ? "w-4 bg-zinc-800 dark:bg-zinc-200 sm:w-6"
            : "w-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 sm:w-3"
        }`}
        onClick={() => onDotClick(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
);
