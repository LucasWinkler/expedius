import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type BiographySectionProps = {
  bio?: string | null;
};

export const BiographySection = ({ bio }: BiographySectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biography</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {bio || "No biography provided yet."}
        </p>
      </CardContent>
    </Card>
  );
};

export default BiographySection;
