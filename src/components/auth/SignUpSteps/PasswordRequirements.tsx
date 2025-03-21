import { minPasswordLength } from "@/constants";
import { Check, X } from "lucide-react";

type Requirement = {
  text: string;
  isMet: boolean;
};

type PasswordRequirementsProps = {
  password: string;
};

export const PasswordRequirements = ({
  password,
}: PasswordRequirementsProps) => {
  const requirements: Requirement[] = [
    {
      text: `At least ${minPasswordLength} characters`,
      isMet: password.length >= minPasswordLength,
    },
    {
      text: "Contains an uppercase letter",
      isMet: /[A-Z]/.test(password),
    },
    {
      text: "Contains a number",
      isMet: /[0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-2">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center space-x-2">
          {req.isMet ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-destructive" />
          )}
          <span className="text-sm text-muted-foreground">{req.text}</span>
        </div>
      ))}
    </div>
  );
};
