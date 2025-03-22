import { SearchSuggestions, SearchBar } from "@/components/search";
import { ParallaxDestinationsWrapper } from "./ParallaxDestinationsWrapper";

export const HomeHero = () => {
  return (
    <section className="relative bg-gradient-to-b from-background via-background/95 to-muted pb-16 pt-16 sm:pb-32 sm:pt-24 2xl:pb-40 2xl:pt-32">
      <div className="absolute inset-0">
        <div className="bg-grid-white absolute inset-0 bg-[size:125px_125px] opacity-15 2xl:bg-[size:150px_150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/40 to-background/20" />
      </div>
      <div className="container relative z-20 mx-auto px-4">
        <header className="mx-auto max-w-4xl rounded-3xl p-4 text-center sm:p-6 2xl:max-w-5xl">
          <h1 className="mx-auto text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            Discover your
            <br />
            next adventure.
          </h1>
          <p className="mx-auto mt-5 max-w-[35ch] text-base text-muted-foreground sm:mt-5 sm:text-lg md:text-xl 2xl:mt-6 2xl:text-2xl">
            Find, organize, and share your favourite places from around the
            world.
          </p>
        </header>
        <div className="mt-8 sm:mt-8 2xl:mt-10">
          <div className="mx-auto max-w-2xl 2xl:max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-6">
            <SearchSuggestions />
          </div>
        </div>
      </div>
      <ParallaxDestinationsWrapper />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-muted to-transparent"></div>
    </section>
  );
};
