import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

type ProfilePrivateViewProps = {
  username: string;
};

export const ProfilePrivateView = ({ username }: ProfilePrivateViewProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <Lock className="size-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">This Profile is Private</h1>
        <p className="mt-2 text-muted-foreground">
          @{username}&apos;s profile is private. Only they can see their profile
          content.
        </p>
      </Card>
    </div>
  );
};
