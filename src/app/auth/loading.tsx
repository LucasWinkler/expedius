import { Loader2 } from "lucide-react";

const AuthLoading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default AuthLoading;
