import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/constants";
import type { ProfileResponse } from "@/server/services/profile";

interface UseProfileOptions {
  username: string;
  initialData?: ProfileResponse;
}

export const useProfile = ({ username, initialData }: UseProfileOptions) => {
  const { data: session } = useSession();

  const { data: profile } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, username],
    queryFn: async () => {
      const response = await fetch(`/api/users/${username}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json() as Promise<ProfileResponse>;
    },
    initialData,
  });

  const isOwner = profile?.type === "public" && session?.user.id === profile.id;

  return {
    profile,
    isOwner,
    isLoading: false,
  };
};
