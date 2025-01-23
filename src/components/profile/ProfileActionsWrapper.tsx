"use client";

import dynamic from "next/dynamic";
import type { User } from "@/server/db/schema";

type ProfileActionsWrapperProps = {
  user: User;
};

const ProfileActions = dynamic(() => import("./ProfileActions"), {
  ssr: false,
});

export const ProfileActionsWrapper = ({ user }: ProfileActionsWrapperProps) => {
  return <ProfileActions user={user} />;
};

export default ProfileActionsWrapper;
