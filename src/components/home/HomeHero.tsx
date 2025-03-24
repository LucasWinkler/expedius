import { SearchBar } from "@/components/search";
import { PersonalizedSearchSuggestions } from "@/components/search/PersonalizedSearchSuggestions";
import { ParallaxDestinationsWrapper } from "./ParallaxDestinationsWrapper";

export const HomeHero = () => {
  return (
    <section className="relative bg-gradient-to-b from-background via-background/95 to-muted pb-16 pt-12 sm:pb-36 sm:pt-28 2xl:pb-44 2xl:pt-36">
      <div className="absolute inset-0">
        <div className="bg-grid-white absolute inset-0 bg-[size:125px_125px] opacity-[0.18] 2xl:bg-[size:150px_150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/40 to-background/20" />
      </div>
      <div className="container relative z-20 mx-auto px-5 sm:px-6">
        <header className="mx-auto max-w-3xl rounded-3xl p-4 text-center sm:p-8 lg:max-w-4xl 2xl:max-w-5xl">
          <h1 className="mx-auto text-3xl font-bold tracking-tight text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.1)] xs:text-4xl sm:text-[3.25rem] md:text-6xl lg:text-7xl 2xl:text-7xl">
            Discover your
            <br />
            next adventure.
          </h1>
          <p className="mx-auto mt-3 max-w-[35ch] text-base text-muted-foreground sm:mt-6 sm:max-w-[40ch] sm:text-lg md:max-w-[45ch] md:text-xl 2xl:mt-8 2xl:text-2xl">
            Find, organize, and share your favourite places from around the
            world with personalized recommendations.
          </p>
        </header>
        <div className="mt-5 sm:mt-8 2xl:mt-10">
          <div className="mx-auto max-w-lg sm:max-w-2xl lg:max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-6 sm:mt-8">
            <PersonalizedSearchSuggestions />
          </div>
        </div>
      </div>
      <ParallaxDestinationsWrapper />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted to-transparent" />
    </section>
  );
};
