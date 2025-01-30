interface CategoryHeaderProps {
  title: string;
}

export const CategoryHeader = ({ title }: CategoryHeaderProps) => (
  <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
);
