import { Share2 } from "lucide-react";

import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn, shouldBeLight } from "@/lib/utils";
import type { DbUser } from "@/server/types/db";

interface ProfileActionsProps {
  colour: DbUser["colour"];
  onEdit: () => void;
  onShare: () => void;
}

export const ProfileActions = ({
  colour,
  onEdit,
  onShare,
}: ProfileActionsProps) => {
  const isLight = shouldBeLight(colour);
  const tooltipClassNames = cn(
    isLight
      ? "bg-black/90 text-primary-foreground"
      : "bg-background/90 text-black",
  );

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-10 w-10 rounded-full bg-background/90 p-0 backdrop-blur-md hover:bg-background/100"
          >
            <Edit />
            <span className="sr-only">Open Edit Profile Dialog</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={tooltipClassNames} side="bottom">
          Edit Profile
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onShare}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/90 p-0 backdrop-blur-md hover:bg-background/100"
          >
            <Share2 />
            <span className="sr-only">Copy Profile Link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className={tooltipClassNames} side="bottom">
          Share Profile
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
