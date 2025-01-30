import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import { CategoryCarousels } from "@/components/home/CategoryCarousel";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Discover your next adventure",
};

const Home = () => {
  return (
    <>
      <HomeHero />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <CategoryCarousels />
      </div>
    </>
  );
};

export default Home;
