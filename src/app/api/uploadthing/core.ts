import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "@/lib/auth/session";

const f = createUploadthing();

export const ourFileRouter = {
  signUpImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { fileUrl: file.url };
    }),

  userListImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
