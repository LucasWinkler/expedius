import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HomeCta = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary/70 py-24 text-primary-foreground">
      <div className="bg-grid-white absolute inset-0 opacity-10" />
      <div className="container relative mx-auto px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to discover your next favourite place?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-foreground/90">
            Create collections of your go-to spots, hidden gems, and must-visit
            places—all in one simple platform.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white px-8 py-3 font-medium text-primary shadow-sm transition-all hover:bg-white/90 hover:shadow-md"
              asChild
            >
              <Link href="/auth/sign-up">Get Started — It&apos;s Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-white/50 bg-transparent px-8 font-medium text-white shadow-sm transition-all hover:text-white"
              asChild
            >
              <Link href="/discover">Explore Places</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
