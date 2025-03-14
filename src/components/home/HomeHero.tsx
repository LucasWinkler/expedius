import { SearchSuggestions, SearchBar } from "@/components/search";

export const HomeHero = () => {
  return (
    <section className="relative bg-gradient-to-b from-background to-muted pb-20 pt-12 sm:pb-32 sm:pt-24 2xl:pb-40 2xl:pt-32">
      <div className="container relative z-10 mx-auto px-4">
        <header className="mx-auto max-w-4xl text-center 2xl:max-w-5xl">
          <h1 className="animate-fade-up mx-auto bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            Discover your
            <br />
            next adventure.
          </h1>
          <p
            className="animate-fade-up mx-auto mt-4 max-w-[35ch] text-base text-muted-foreground opacity-0 sm:mt-5 sm:text-lg md:text-xl 2xl:mt-6 2xl:text-2xl"
            style={{ animationDelay: "100ms" }}
          >
            Find, organize, and share your favourite places from around the
            world.
          </p>
        </header>

        <div
          className="animate-fade-up mt-6 opacity-0 sm:mt-8 2xl:mt-10"
          style={{ animationDelay: "200ms" }}
        >
          <div className="mx-auto max-w-2xl 2xl:max-w-3xl">
            <SearchBar />
          </div>
          <SearchSuggestions />
        </div>
      </div>

      <div className="absolute inset-0">
        <div className="bg-grid-white absolute inset-0 bg-[size:125px_125px] opacity-10 2xl:bg-[size:150px_150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/25 to-background/0" />
      </div>
    </section>
  );
};
