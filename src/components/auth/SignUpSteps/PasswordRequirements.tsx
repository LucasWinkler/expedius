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
      text: "At least 8 characters",
      isMet: password.length >= 8,
    },
    {
      text: "Contains a number",
      isMet: /\d/.test(password),
    },
    {
      text: "Contains a special character",
      isMet: /[!@#$%^&*(),.?":{}|<>]/.test(password),
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
