import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { env } from "@/env";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export function getStrictUploadThingUrl(fileUrl: string | null | undefined) {
  if (!fileUrl) return fileUrl;

  const fileKey = fileUrl.split("/").pop();
  if (!fileKey) throw new Error("Invalid UploadThing URL");

  return `https://utfs.io/a/${env.UPLOADTHING_APP_ID}/${fileKey}`;
}
