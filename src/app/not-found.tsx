import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPinOff } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <MapPinOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t find the page you were looking for.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
