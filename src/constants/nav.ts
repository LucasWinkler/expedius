import {
  Home,
  Search,
  Grid2X2,
  UserCircle,
  Folders,
  FolderHeart,
  File,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    href: "/discover",
    icon: Search,
    label: "Discover",
  },
  {
    href: "/categories",
    icon: Grid2X2,
    label: "Categories",
  },
  {
    href: "/privacy",
    icon: File,
    label: "Privacy",
  },
] as const;

export const MOBILE_NAV_ITEMS = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  ...NAV_ITEMS,
] as const;

export const USER_NAV_ITEMS = [
  {
    href: (username: string) => `/u/${username}/likes`,
    icon: FolderHeart,
    label: "Likes",
  },
  {
    href: (username: string) => `/u/${username}/lists`,
    icon: Folders,
    label: "Lists",
  },
  {
    href: (username: string) => `/u/${username}`,
    icon: UserCircle,
    label: "Profile",
  },
] as const;

export const FOOTER_NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
  },
  ...NAV_ITEMS,
] as const;
