import React from "react";
import { render, screen } from "@testing-library/react";
import ScrollDownButton from "../../components/chat/ScrollDownButton";
import userEvent from "@testing-library/user-event";

describe("ScrollDownButton", () => {
  const scrollDownMock = vi.fn();

  it("should render button with arrow down", () => {
    render(<ScrollDownButton scrollDown={scrollDownMock} />);

    const button = screen.getByTestId("scrollDownButton");

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      "fixed bottom-[20%] bg-slate-900 text-3xl text-white p-2 rounded-full animate-bounce"
    );
  });

  it("should call scrollDown function when clicked", async () => {
    const user = userEvent.setup();
    render(<ScrollDownButton scrollDown={scrollDownMock} />);

    const button = screen.getByTestId("scrollDownButton");
    await user.click(button);

    expect(scrollDownMock).toHaveBeenCalledOnce();
  });
});
