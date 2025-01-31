import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileAvatarProps {
  image: string | null;
  name: string | null;
  username: string;
}

export const ProfileAvatar = ({
  image,
  name,
  username,
}: ProfileAvatarProps) => {
  return (
    <Avatar className="size-40 overflow-hidden rounded-full border-4 border-background bg-muted">
      <AvatarImage
        className="object-cover"
        src={image ?? undefined}
        alt={name ?? username}
      />
      <AvatarFallback className="text-2xl">
        {name?.[0] ?? username[0]}
      </AvatarFallback>
    </Avatar>
  );
};
