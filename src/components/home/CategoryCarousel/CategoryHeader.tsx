import { LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  icon: LucideIcon;
}

export const CategoryHeader = ({ title, icon: Icon }: CategoryHeaderProps) => (
  <div className="mb-4 flex items-center gap-3">
    <div className="inline-flex rounded-full bg-primary/10 p-3.5 text-primary">
      <Icon className="size-7" />
    </div>
    <h3 className="text-2xl font-semibold">{title}</h3>
  </div>
);
