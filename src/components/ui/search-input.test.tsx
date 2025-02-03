import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  it("renders with placeholder", () => {
    render(<SearchInput placeholder="Test placeholder" onClear={vi.fn()} />);
    expect(screen.getByPlaceholderText("Test placeholder")).toBeInTheDocument();
  });

  it("shows clear button when there is input value", () => {
    render(<SearchInput value="test" onChange={() => {}} onClear={vi.fn()} />);
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("hides clear button when input is empty", () => {
    render(<SearchInput value="" onChange={() => {}} onClear={vi.fn()} />);
    expect(
      screen.queryByRole("button", { name: /clear/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onClear when clear button is clicked", () => {
    const handleClear = vi.fn();
    render(
      <SearchInput value="test" onChange={() => {}} onClear={handleClear} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
