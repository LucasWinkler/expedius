import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const BiographySkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biography</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
};
