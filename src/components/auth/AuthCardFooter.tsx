import { Home, Search } from "lucide-react";
import Link from "next/link";

interface AuthCardFooterProps {
  altAction: string;
  altActionLink: string;
}

export const AuthCardFooter = ({
  altAction,
  altActionLink,
}: AuthCardFooterProps) => {
  return (
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
  );
};
