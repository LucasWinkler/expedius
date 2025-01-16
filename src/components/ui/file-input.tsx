"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type FileInputProps = {
  onChange: (files: File[] | null | undefined) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
  existingImage?: string | null;
  variant?: "landscape" | "square";
};

export const FileInput = ({
  onChange,
  onClear,
  disabled,
  className,
  existingImage,
  variant = "landscape",
}: FileInputProps) => {
  const [preview, setPreview] = useState<string>();
  const [isExistingImageHidden, setIsExistingImageHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      setPreview(URL.createObjectURL(files[0]));
      setIsExistingImageHidden(true);
      onChange(Array.from(files));
    } else {
      onChange(undefined);
    }
  };

  const handleClear = () => {
    if (preview) {
      setPreview(undefined);
      setIsExistingImageHidden(false);
    } else {
      setIsExistingImageHidden(true);
    }
    onClear();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showPreview =
    preview || (!preview && existingImage && !isExistingImageHidden);
  const previewUrl = preview || (isExistingImageHidden ? null : existingImage);

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
          <Upload className="mr-2 size-4" />
          {showPreview ? "Change Image" : "Upload Image"}
        </Button>

        {showPreview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="p-2"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="size-4" />
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
      {showPreview && previewUrl && (
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border bg-muted",
            variant === "landscape" ? "aspect-video" : "aspect-square",
            "w-full",
          )}
        >
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={60}
            priority={false}
          />
        </div>
      )}
    </div>
  );
};
