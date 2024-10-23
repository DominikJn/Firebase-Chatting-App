import React from "react";
import { render, screen } from "@testing-library/react";
import MessagePreview from "../../components/chat/MessagePreview";
import userEvent from "@testing-library/user-event";

describe("MessagePreview", () => {
  let file: File = new File(["hello"], "hello.png", { type: "image/png" });
  global.URL.createObjectURL = vi.fn();

  const mockSetFile = vi.fn();

  it("should render text passed in props", () => {
    render(<MessagePreview text={"Hello World!"} setFile={mockSetFile} />);

    expect(screen.getByText("Hello World!")).toBeInTheDocument();
  });

  it("should render file passed in props", () => {
    render(<MessagePreview file={file} setFile={mockSetFile} />);

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("should unselect file when x button is clicked", async () => {
    const user = userEvent.setup();
    render(<MessagePreview file={file} setFile={mockSetFile} />);

    const button = screen.getByRole("button", { name: /x/i });
    await user.click(button);

    expect(mockSetFile).toHaveBeenCalledOnce();
  });
});
