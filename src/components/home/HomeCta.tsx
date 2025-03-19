import Link from "next/link";

export const HomeCta = () => {
  return (
    <section className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Start your journey today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Create an account to save your favourite places, build custom lists,
            and share your discoveries with others.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore Places
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
