"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TogglePasswordVisibilityButtonProps {
  showPassword: boolean;
  onClick: () => void;
}

const TogglePasswordVisibilityButton = ({
  showPassword,
  onClick,
}: TogglePasswordVisibilityButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      onClick={onClick}
    >
      {showPassword ? (
        <EyeOff className="size-4 text-muted-foreground" />
      ) : (
        <Eye className="size-4 text-muted-foreground" />
      )}
      <span className="sr-only">
        {showPassword ? "Hide password" : "Show password"}
      </span>
    </Button>
  );
};

TogglePasswordVisibilityButton.displayName = "TogglePasswordVisibilityButton";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <TogglePasswordVisibilityButton
          showPassword={showPassword}
          onClick={handleTogglePasswordVisibility}
        />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
