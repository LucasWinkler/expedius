import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-start">
            <h3 className="text-xl font-bold">PoiToGo</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Discover local favourites, hidden gems, and must-visit spots
              around the world
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:items-end md:gap-6">
            <nav className="flex gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground hover:no-underline"
              >
                Home
              </Link>
              <Link
                href="/discover"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground hover:no-underline"
              >
                Discover
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              Developed by{" "}
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

export default Footer;
