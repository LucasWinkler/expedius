import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { ProxiedImage } from "@/components/ui/ProxiedImage";

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
    <div className="relative size-40 overflow-hidden rounded-full border-4 border-background bg-muted">
      <Avatar className="size-full">
        <AvatarImage src={image ?? undefined} alt={name ?? username} />
        <AvatarFallback>{name?.[0] ?? username[0]}</AvatarFallback>
      </Avatar>
      {/* {user.image && (
        <ProxiedImage
          src={user.image}
          alt={user.name ?? user.username}
          fill
          className="object-cover"
        />
      )} */}
    </div>
  );
};
