import { AuthCardFooter } from "./AuthCardFooter";

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
      <AuthCardFooter altAction={altAction} altActionLink={altActionLink} />
    </div>
  );
};
