import { CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface ListTitleProps {
  name: string;
}

export const ListTitle = ({ name }: ListTitleProps) => (
  <div className="flex items-start gap-2">
    <CardTitle className="line-clamp-1 text-lg group-hover:underline group-hover:underline-offset-4">
      {name}
    </CardTitle>
    <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:text-foreground peer-hover:rotate-45 peer-hover:text-foreground" />
  </div>
);
