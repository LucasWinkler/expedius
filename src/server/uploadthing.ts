import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const uploadRouter = {
  signUpImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { fileUrl: file.url };
    }),

  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
