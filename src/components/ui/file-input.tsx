import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

type FileInputProps = {
  onChange: (files: File[] | null) => void;
  value: File[] | null;
  disabled?: boolean;
  className?: string;
};

export const FileInput = ({
  onChange,
  value,
  disabled,
  className,
}: FileInputProps) => {
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      setPreview(URL.createObjectURL(files[0]));
      onChange(Array.from(files));
    } else {
      onChange(null);
    }
  };

  const handleClear = () => {
    setPreview(undefined);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {preview ? "Change Image" : "Upload Image"}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      {preview && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};
