"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PlaceDetailsInfoItemProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export const PlaceDetailsInfoItem = ({
  icon: Icon,
  title,
  children,
}: PlaceDetailsInfoItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div>
        <h3 className="font-medium">{title}</h3>
        {children}
      </div>
    </div>
  );
};
