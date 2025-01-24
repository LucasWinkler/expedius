import { getUser } from "@/server/services/profile";
import { BiographySection } from "./BiographySection";

export const BiographyContent = async ({ username }: { username: string }) => {
  const user = await getUser(username);
  if (!user || "type" in user) return null;

  return <BiographySection bio={user.bio} />;
};
