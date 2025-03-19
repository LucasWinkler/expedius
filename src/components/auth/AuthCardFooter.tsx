import { AUTH_FOOTER_NAV_ITEMS } from "@/constants/nav";
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
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        {AUTH_FOOTER_NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <Icon className="size-3 shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};
