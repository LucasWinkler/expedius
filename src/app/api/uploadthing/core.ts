import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "@/server/auth/session";
import { getStrictUploadThingUrl } from "@/lib/uploadthing";

const f = createUploadthing();

export const ourFileRouter = {
  signUpImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { fileUrl: getStrictUploadThingUrl(file.url) };
    }),
  updateProfileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { fileUrl: getStrictUploadThingUrl(file.url) };
    }),
  userListImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { fileUrl: getStrictUploadThingUrl(file.url) };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
