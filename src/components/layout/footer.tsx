import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-xl font-extrabold tracking-tighter text-transparent transition-colors hover:from-foreground hover:via-foreground/80 hover:to-foreground/60 xl:mr-10 2xl:text-xl"
              aria-label="Expedius Home"
            >
              Expedius
            </Link>
            <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground md:text-start">
              Find, organize, and share your favourite places from around the
              world.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <nav aria-label="Footer navigation" className="flex gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Home
              </Link>
              <Link
                href="/discover"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Discover
              </Link>
              <Link
                href="/categories"
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Categories
              </Link>
            </nav>
            <p className="text-center text-sm text-muted-foreground md:text-start">
              © {new Date().getFullYear()} Expedius · Developed by{" "}
              <Link
                href="https://github.com/lucaswinkler"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground hover:no-underline"
              >
                Lucas Winkler
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
