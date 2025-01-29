"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProxiedImage } from "./ProxiedImage";

interface FileInputProps {
  onChange: (file?: File | null) => void;
  onClear: () => void;
  disabled?: boolean;
  className?: string;
  existingImage?: string | null;
  variant?: "landscape" | "square";
}

export const FileInput = ({
  onChange,
  onClear,
  disabled,
  className,
  existingImage,
  variant = "landscape",
}: FileInputProps) => {
  const [preview, setPreview] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
      setIsRemoved(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
      setIsRemoved(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (preview) {
      onChange(undefined);
    } else if (existingImage) {
      setIsRemoved(true);
      onChange(null);
    }
    onClear();
  };

  const imageToShow = preview || (!isRemoved && existingImage);

  return (
    <div className={cn(className, "relative")}>
      <div className="space-y-2">
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) {
              setIsDragging(true);
            }
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "group relative cursor-pointer border bg-muted transition-colors",
            isDragging && "border-primary/50 bg-muted/80",
            disabled && "cursor-not-allowed opacity-60",
            variant === "landscape"
              ? "h-32 w-full rounded-lg"
              : "size-32 rounded-full",
          )}
        >
          {imageToShow ? (
            <>
              {preview ? (
                <Image
                  src={imageToShow}
                  alt="Preview"
                  fill
                  className={cn(
                    "object-cover",
                    variant === "landscape" ? "rounded-lg" : "rounded-full",
                  )}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={60}
                  priority={false}
                />
              ) : (
                <ProxiedImage
                  src={imageToShow}
                  alt="Preview"
                  fill
                  className={cn(
                    "object-cover",
                    variant === "landscape" ? "rounded-lg" : "rounded-full",
                  )}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={60}
                  priority={false}
                />
              )}
              {!disabled && (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
                    variant === "landscape" ? "rounded-lg" : "rounded-full",
                  )}
                >
                  <Upload className="size-8 text-white" />
                </div>
              )}
              {!disabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleClear}
                  className={cn(
                    "absolute h-7 w-7 bg-white/80 backdrop-blur-sm hover:bg-white",
                    variant === "landscape"
                      ? "right-2 top-2"
                      : "right-1 top-1 rounded-full",
                  )}
                  disabled={isRemoved && !preview}
                >
                  <X className="size-4" />
                </Button>
              )}
            </>
          ) : (
            <div
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-1.5 px-2 text-center",
                variant === "square" && "px-4",
              )}
            >
              <Upload className="size-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isDragging ? "Drop image here" : "Click or drag image"}
              </span>
            </div>
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
      </div>
    </div>
  );
};
