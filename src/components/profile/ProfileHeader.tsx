import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DbUser } from "@/server/db/schema";
import { ProfileActionsWrapper } from "./ProfileActionsWrapper";

interface ProfileHeaderProps {
  user: DbUser;
  isOwnProfile: boolean;
  totalLists: number;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  totalLists,
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col items-center md:flex-row md:items-center">
        <Avatar className="size-32">
          <AvatarImage
            src={user.image || undefined}
            alt={user.name ?? user.username}
          />
          <AvatarFallback>{user.name?.[0] ?? user.username[0]}</AvatarFallback>
        </Avatar>
        <div className="mt-4 text-center md:ml-6 md:mt-0 md:text-left">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <div className="mt-2 flex justify-center space-x-4 md:justify-start">
            <span>
              {totalLists} List{totalLists === 1 ? "" : "s"}
            </span>
            <span>0 Followers</span>
            <span>0 Following</span>
          </div>
        </div>
      </div>
      {isOwnProfile && <ProfileActionsWrapper user={user} />}
    </div>
  );
};

export default ProfileHeader;
