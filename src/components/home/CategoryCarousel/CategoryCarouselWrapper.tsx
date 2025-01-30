import { forwardRef, ReactNode } from "react";

interface CategoryCarouselWrapperProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const CategoryCarouselWrapper = forwardRef<
  HTMLElement,
  CategoryCarouselWrapperProps
>(({ title, children, className }, ref) => (
  <section className={className} ref={ref}>
    <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
    {children}
  </section>
));

CategoryCarouselWrapper.displayName = "CategoryCarouselWrapper";
