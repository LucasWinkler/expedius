import { describe, expect, it } from "vitest";
import { getPlacePhotoUrl } from "./utils";

describe("getPlacePhotoUrl", () => {
  it("should generate correct photo URL with default dimensions", () => {
    const photoRef = "abc123";
    const url = getPlacePhotoUrl(photoRef);
    expect(url).toBe("/api/places/photo/abc123?maxHeightPx=400&maxWidthPx=400");
  });

  it("should generate correct photo URL with custom dimensions", () => {
    const photoRef = "abc123";
    const url = getPlacePhotoUrl(photoRef, 800, 600);
    expect(url).toBe("/api/places/photo/abc123?maxHeightPx=600&maxWidthPx=800");
  });

  it("should handle special characters in photo reference", () => {
    const photoRef = "abc/123?&";
    const url = getPlacePhotoUrl(photoRef);
    expect(url).toBe(
      "/api/places/photo/abc%2F123%3F%26?maxHeightPx=400&maxWidthPx=400",
    );
  });
});
