import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { env } from "@/env";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export function getStrictUploadThingUrl(fileUrl: string) {
  const fileKey = fileUrl.split("/").pop();
  if (!fileKey) throw new Error("Invalid UploadThing URL");

  return `https://${env.UPLOADTHING_APP_ID}.ufs.sh/f/${fileKey}`;
}
