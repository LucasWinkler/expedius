"use client";

import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  LogOut,
  Shield,
  Clock,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { SettingsSection } from "../components/SettingsSection";
import { refreshUserSession } from "@/server/actions/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SessionsProps {
  sessionToken?: string;
}

interface Session {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  lastActiveAt?: string;
  isCurrent?: boolean;
  deviceType?: "desktop" | "mobile" | "tablet";
}

function extractTokenId(fullToken?: string): string | undefined {
  if (!fullToken) return undefined;
  return fullToken.split(".")[0];
}

export function SessionsSection({ sessionToken }: SessionsProps) {
  const { data: sessionData } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const currentTokenId = extractTokenId(sessionToken);

  function handleDialogClose(isOpen: boolean) {
    setShowConfirmDialog(isOpen);

    if (!isOpen) {
      setSelectedSession(null);
    }
  }

  useEffect(() => {
    const fetchSessions = async () => {
      if (!sessionData) return;

      try {
        setIsLoading(true);
        const result = await authClient.listSessions();

        if (result && "data" in result && result.data) {
          const enhancedSessions = result.data.map((session) => {
            const tokenValue = session.token || "";

            return {
              ...session,
              id: session.id || "",
              token: tokenValue,
              createdAt: session.createdAt
                ? new Date(session.createdAt).toISOString()
                : new Date().toISOString(),
              lastActiveAt: session.updatedAt
                ? new Date(session.updatedAt).toISOString()
                : undefined,
              isCurrent: currentTokenId ? tokenValue === currentTokenId : false,
            };
          });

          const sortedSessions = enhancedSessions.sort((a, b) => {
            if (a.isCurrent) return -1;
            if (b.isCurrent) return 1;

            const dateA = a.lastActiveAt || a.createdAt;
            const dateB = b.lastActiveAt || b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });

          setSessions(sortedSessions);
        } else {
          toast.error("Failed to load sessions");
          setSessions([]);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Failed to load sessions");
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [sessionData, currentTokenId]);

  const handleRevokeSession = async (session: Session) => {
    setIsRevoking(true);
    try {
      await authClient.revokeSession({
        token: session.token,
      });

      setSessions(sessions.filter((s) => s.token !== session.token));

      toast.success("Session revoked successfully");
      await refreshUserSession();
    } catch (error) {
      console.error("Error revoking session:", error);
      toast.error("Failed to revoke session");
    } finally {
      setIsRevoking(false);
      setShowConfirmDialog(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingAll(true);
    try {
      await authClient.revokeOtherSessions();

      setSessions(sessions.filter((session) => session.isCurrent));

      toast.success("All other sessions revoked successfully");
      await refreshUserSession();
    } catch (error) {
      console.error("Error revoking sessions:", error);
      toast.error("Failed to revoke sessions");
    } finally {
      setIsRevokingAll(false);
    }
  };

  const formatDeviceInfo = (session: Session) => {
    if (!session.userAgent) return "Unknown device";

    const isMobile = /mobile/i.test(session.userAgent);
    const isTablet = /tablet|ipad/i.test(session.userAgent);

    let deviceType = "Desktop";
    if (isMobile) deviceType = "Mobile";
    if (isTablet) deviceType = "Tablet";

    session.deviceType = deviceType.toLowerCase() as
      | "desktop"
      | "mobile"
      | "tablet";

    let browser = "Unknown";
    if (session.userAgent.includes("Chrome")) browser = "Chrome";
    if (session.userAgent.includes("Firefox")) browser = "Firefox";
    if (
      session.userAgent.includes("Safari") &&
      !session.userAgent.includes("Chrome")
    )
      browser = "Safari";
    if (session.userAgent.includes("Edge")) browser = "Edge";

    return `${deviceType} • ${browser}`;
  };

  const getDeviceIcon = (session: Session) => {
    if (session.isCurrent) {
      return <CheckCircle2 className="h-5 w-5 text-primary" />;
    }

    switch (session.deviceType) {
      case "mobile":
        return <Smartphone className="h-5 w-5 text-muted-foreground" />;
      case "tablet":
        return <Tablet className="h-5 w-5 text-muted-foreground" />;
      case "desktop":
      default:
        return <Monitor className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <SettingsSection
      title="Active Sessions"
      description="Manage your active sessions across all devices. You can revoke access to any session."
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <SessionCardSkeleton />
            <SessionCardSkeleton />
          </div>
        ) : (
          <>
            {sessions.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No active sessions found
              </div>
            ) : (
              <div className="divide-y rounded-md border">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center",
                      session.isCurrent ? "bg-muted/40" : "",
                    )}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="flex-shrink-0">
                        {getDeviceIcon(session)}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {formatDeviceInfo(session)}
                          </span>
                          {session.isCurrent && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{session.ipAddress || "::1"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <RelativeTime
                              date={session.lastActiveAt || session.createdAt}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {session.isCurrent ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="mt-2 w-full sm:mt-0 sm:w-auto"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Current Device
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session);
                          setShowConfirmDialog(true);
                        }}
                        className="mt-2 w-full sm:mt-0 sm:w-auto"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Revoke Access
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {sessions.length > 1 && (
              <>
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-900/20 dark:text-yellow-500">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      If you notice any suspicious activity, revoke the session
                      and change your password immediately.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={handleRevokeOtherSessions}
                    disabled={isRevokingAll || sessions.length <= 1}
                    className="w-full sm:w-auto"
                  >
                    {isRevokingAll ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Shield className="mr-2 h-4 w-4" />
                    )}
                    Revoke All Other Sessions
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Session Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke access for this device? This will
              immediately end the session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                selectedSession && handleRevokeSession(selectedSession)
              }
              disabled={isRevoking}
            >
              {isRevoking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  );
}

function RelativeTime({ date }: { date: string }) {
  if (!date) return <span>Unknown</span>;

  const now = new Date();
  const sessionDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - sessionDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) return <span>Just now</span>;

  const minutes = Math.floor(diffInSeconds / 60);
  if (diffInSeconds < 3600)
    return (
      <span>
        {minutes} {minutes === 1 ? "minute" : "minutes"} ago
      </span>
    );

  const hours = Math.floor(diffInSeconds / 3600);
  if (diffInSeconds < 86400)
    return (
      <span>
        {hours} {hours === 1 ? "hour" : "hours"} ago
      </span>
    );

  const days = Math.floor(diffInSeconds / 86400);
  if (diffInSeconds < 604800)
    return (
      <span>
        {days} {days === 1 ? "day" : "days"} ago
      </span>
    );

  return <span>{sessionDate.toLocaleDateString()}</span>;
}

function SessionCardSkeleton() {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div>
            <Skeleton className="mb-2 h-4 w-40" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}
