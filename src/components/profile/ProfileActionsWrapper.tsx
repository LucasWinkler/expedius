"use client";

import dynamic from "next/dynamic";
import type { User } from "@/server/db/schema";

type ProfileActionsWrapperProps = {
  user: User;
};

const ProfileActions = dynamic(() => import("./ProfileActions"), {
  // loading: () => (
  //   <div className="mt-4 flex animate-pulse space-x-2 md:mt-0">
  //     <div className="h-9 w-[107px] rounded-md bg-muted" />
  //     <div className="h-9 w-[102px] rounded-md bg-muted" />
  //     <div className="h-9 w-[95px] rounded-md bg-muted" />
  //   </div>
  // ),
  ssr: false,
});

export const ProfileActionsWrapper = ({ user }: ProfileActionsWrapperProps) => {
  return <ProfileActions user={user} />;
};

export default ProfileActionsWrapper;
