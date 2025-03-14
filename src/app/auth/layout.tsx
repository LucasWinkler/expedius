import Link from "next/link";
import Image from "next/image";
import authBackground from "@/assets/auth-background.jpg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white md:flex">
        <Image
          src={authBackground}
          alt="Person holding map during daytime with architecture in the background"
          fill
          className="absolute inset-0 object-cover"
          priority
          placeholder="blur"
          sizes="(min-width: 768px) 50vw, 0vw"
        />

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-neutral-900/40 to-neutral-900/80" />

        <div className="relative z-20 flex flex-col">
          <Link href="/" className="text-lg font-medium drop-shadow-lg">
            Expedius
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg drop-shadow-lg">
              Discover and share your favourite local spots.
            </p>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-10">{children}</div>
    </div>
  );
};

export default AuthLayout;
