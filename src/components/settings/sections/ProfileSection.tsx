"use client";

import { ClientUser } from "@/lib/auth-client";
import { SettingsSection } from "../components/SettingsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";

interface ProfileSectionProps {
  user: ClientUser;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <SettingsSection
      title="Profile"
      description="Manage your profile information"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-medium">Profile information</p>
            <p className="text-sm text-muted-foreground">
              Edit your profile name, username, and privacy settings
            </p>
          </div>
          <Button asChild>
            <Link href={`/u/${user.username}`}>
              <User className="mr-2 size-4" />
              View Profile
            </Link>
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
}
