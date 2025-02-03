import { Home, Search } from "lucide-react";
import Link from "next/link";

type AuthCardProps = {
  heading: string;
  subheading: string;
  altAction: string;
  altActionLink: string;
  children: React.ReactNode;
};

export const AuthCard = ({
  heading,
  subheading,
  altAction,
  altActionLink,
  children,
}: AuthCardProps) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
        <p className="text-sm text-muted-foreground">{subheading}</p>
      </div>
      {children}
      <div className="flex flex-col space-y-4">
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href={altActionLink} className="underline underline-offset-4">
            {altAction}
          </Link>
        </p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Home className="size-3" />
            Home
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Search className="size-3" />
            <span>Discover</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
