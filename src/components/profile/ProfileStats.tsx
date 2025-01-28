interface ProfileStatsProps {
  totalLists: number;
  totalLikes: number;
}

export const ProfileStats = ({ totalLists, totalLikes }: ProfileStatsProps) => {
  return (
    <div className="mt-6 flex gap-8">
      <div className="text-center">
        <p className="text-2xl font-bold">{totalLists}</p>
        <p className="text-sm text-muted-foreground">Lists</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold">{totalLikes}</p>
        <p className="text-sm text-muted-foreground">Likes</p>
      </div>
    </div>
  );
};
