import Link from "next/link";

interface ProfileStatsProps {
  totalLists: number;
  totalLikes: number;
  username: string;
}

export const ProfileStats = ({
  totalLists,
  totalLikes,
  username,
}: ProfileStatsProps) => {
  return (
    <div className="mt-6 flex gap-8">
      <Link
        href={`/u/${username}/lists`}
        className="text-center transition-colors hover:text-primary"
        aria-label={`View ${username}'s lists`}
      >
        <p className="text-2xl font-bold">{totalLists}</p>
        <p className="text-sm text-muted-foreground group-hover:text-primary/75">
          Lists
        </p>
      </Link>
      <Link
        href={`/u/${username}/likes`}
        className="text-center transition-colors hover:text-primary"
        aria-label={`View ${username}'s likes`}
      >
        <p className="text-2xl font-bold">{totalLikes}</p>
        <p className="text-sm text-muted-foreground group-hover:text-primary/75">
          Likes
        </p>
      </Link>
    </div>
  );
};
