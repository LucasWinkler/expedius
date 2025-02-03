import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside";
import { useRef } from "react";

const TestComponent = ({ onClickOutside }: { onClickOutside: () => void }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useClickOutside(elementRef, onClickOutside);
  return (
    <div>
      <div data-testid="outside">Outside Element</div>
      <div ref={elementRef} data-testid="inside">
        Inside Element
      </div>
    </div>
  );
};

const NullRefComponent = ({
  onClickOutside,
}: {
  onClickOutside: () => void;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  useClickOutside(elementRef, onClickOutside);
  return (
    <div>
      <div data-testid="outside">Outside Element</div>
    </div>
  );
};

describe("useClickOutside", () => {
  it("should call handler when clicking outside", () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent onClickOutside={handler} />);

    fireEvent.mouseDown(getByTestId("outside"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not call handler when clicking inside", () => {
    const handler = vi.fn();
    const { getByTestId } = render(<TestComponent onClickOutside={handler} />);

    fireEvent.mouseDown(getByTestId("inside"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("should not call handler when ref is null", () => {
    const handler = vi.fn();
    const { getByTestId } = render(
      <NullRefComponent onClickOutside={handler} />,
    );

    fireEvent.mouseDown(getByTestId("outside"));
    expect(handler).not.toHaveBeenCalled();
  });
});
