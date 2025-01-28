interface ProfileInfoProps {
  name: string | null;
  username: string;
}

export const ProfileInfo = ({ name, username }: ProfileInfoProps) => {
  return (
    <div className="mt-4 text-center">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="text-muted-foreground">@{username}</p>
    </div>
  );
};
