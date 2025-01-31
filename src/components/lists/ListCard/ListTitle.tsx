import { ArrowUpRight } from "lucide-react";

interface ListTitleProps {
  name: string;
}

export const ListTitle = ({ name }: ListTitleProps) => (
  <h2 className="line-clamp-1 flex items-start gap-2 text-lg font-semibold leading-none tracking-tight group-hover:underline group-hover:underline-offset-4">
    {name}
    <ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:text-foreground peer-hover:rotate-45 peer-hover:text-foreground" />
  </h2>
);
