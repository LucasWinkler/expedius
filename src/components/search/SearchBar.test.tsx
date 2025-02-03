import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { SearchBar } from "./SearchBar";
import { useSearch } from "@/hooks/useSearch";

vi.mock("@/hooks/useSearch", () => ({
  useSearch: vi.fn(() => ({
    query: "",
    updateSearchParams: vi.fn(),
  })),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders basic search input", () => {
    render(<SearchBar />);
    expect(
      screen.getByPlaceholderText("Search for places..."),
    ).toBeInTheDocument();
  });

  it("shows validation error for short queries", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for places...");

    await userEvent.type(input, "a");
    fireEvent.submit(input);

    await waitFor(() => {
      expect(screen.getByText(/Please enter at least/)).toBeInTheDocument();
    });
  });

  it("calls updateSearchParams on valid form submission", async () => {
    const mockUpdateSearchParams = vi.fn();
    (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      query: "",
      updateSearchParams: mockUpdateSearchParams,
    });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for places...");

    await userEvent.type(input, "coffee shop");
    fireEvent.submit(input);

    await waitFor(() => {
      expect(mockUpdateSearchParams).toHaveBeenCalledWith({
        query: "coffee shop",
        filters: {
          radius: expect.any(Number),
          minRating: undefined,
          openNow: false,
        },
      });
    });
  });

  describe("Search History", () => {
    it("does not show history popup when there are no items", async () => {
      render(<SearchBar />);
      const input = screen.getByPlaceholderText("Search for places...");

      await userEvent.click(input);
      expect(screen.queryByText("Recent Searches")).not.toBeInTheDocument();
    });

    it("shows history popup on input focus when there are items", async () => {
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(["coffee shop", "restaurant"]),
      );
      render(<SearchBar />);
      const input = screen.getByPlaceholderText("Search for places...");

      await userEvent.click(input);

      expect(screen.getByText("Recent Searches")).toBeInTheDocument();
      expect(screen.getByText("coffee shop")).toBeInTheDocument();
      expect(screen.getByText("restaurant")).toBeInTheDocument();
    });

    it("shows history popup on input click when there are items", async () => {
      localStorage.setItem("searchHistory", JSON.stringify(["coffee shop"]));
      render(<SearchBar />);
      const input = screen.getByPlaceholderText("Search for places...");

      await userEvent.click(input);
      expect(screen.getByText("Recent Searches")).toBeInTheDocument();
    });

    it("hides history popup when clicking outside", async () => {
      localStorage.setItem("searchHistory", JSON.stringify(["coffee shop"]));
      render(
        <div>
          <div data-testid="outside-element">Outside</div>
          <SearchBar />
        </div>,
      );
      const input = screen.getByPlaceholderText("Search for places...");

      await userEvent.click(input);
      expect(screen.getByText("Recent Searches")).toBeInTheDocument();

      await userEvent.click(screen.getByTestId("outside-element"));
      await waitFor(() => {
        expect(screen.queryByText("Recent Searches")).not.toBeInTheDocument();
      });
    });

    it("saves search to history on submission", async () => {
      render(<SearchBar />);
      const input = screen.getByPlaceholderText("Search for places...");

      await userEvent.type(input, "coffee shop");
      fireEvent.submit(input);

      await userEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText("coffee shop")).toBeInTheDocument();
      });
    });

    it("removes item from search history", async () => {
      localStorage.setItem("searchHistory", JSON.stringify(["coffee shop"]));

      render(<SearchBar />);
      const input = screen.getByPlaceholderText("Search for places...");

      await userEvent.click(input);

      const removeButton = screen.getByRole("button", { name: "" });
      await userEvent.click(removeButton);

      expect(screen.queryByText("coffee shop")).not.toBeInTheDocument();
    });
  });

  describe("Advanced variant", () => {
    it("renders filters when variant is advanced", async () => {
      render(<SearchBar variant="advanced" />);
      await waitFor(() => {
        expect(screen.getByText("Search Filters")).toBeInTheDocument();
      });
    });

    it("updates filters on interaction", async () => {
      const mockUpdateSearchParams = vi.fn();
      (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        query: "",
        updateSearchParams: mockUpdateSearchParams,
      });

      render(<SearchBar variant="advanced" />);

      await waitFor(async () => {
        const openNowSwitch = screen.getByRole("switch");
        await userEvent.click(openNowSwitch);

        const input = screen.getByPlaceholderText("Search for places...");
        await userEvent.type(input, "coffee shop");
        fireEvent.submit(input);
      });

      await waitFor(() => {
        expect(mockUpdateSearchParams).toHaveBeenCalledWith({
          query: "coffee shop",
          filters: {
            radius: expect.any(Number),
            minRating: undefined,
            openNow: true,
          },
        });
      });
    });
  });
});
