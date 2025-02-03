import { LucideIcon } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  icon: LucideIcon;
}

export const CategoryHeader = ({ title, icon: Icon }: CategoryHeaderProps) => (
  <div className="mb-4 flex items-center gap-4">
    <Icon className="size-8 text-primary" />
    <h2 className="text-2xl font-semibold">{title}</h2>
  </div>
);
