import React from "react";
import { render, screen } from "@testing-library/react";
import MessageForm from "../../components/chat/MessageForm";
import userEvent from "@testing-library/user-event";

describe("MessageForm", () => {
  global.URL.createObjectURL = vi.fn();
  const mockHandleMessageFormSubmit = vi.fn().mockResolvedValue(undefined);

  const file = new File(["hello"], "hello.png", { type: "image/png" });

  it("should render form correctly", () => {
    render(
      <MessageForm handleMessageFormSubmit={mockHandleMessageFormSubmit} />
    );

    const messageInput = screen.getByPlaceholderText(/write/i);
    const fileInput = screen.getByTestId("file");
    const sendButton = screen.getByTestId("submit");

    expect(messageInput).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it("should render view of chosen files", async () => {
    const user = userEvent.setup();
    render(
      <MessageForm handleMessageFormSubmit={mockHandleMessageFormSubmit} />
    );

    const fileInput = screen.getByTestId("file");
    await user.upload(fileInput, file);

    const fileView = await screen.findByTestId("file-view");
    expect(fileView).toBeInTheDocument();
  });

  it("should call a handleMessageFormSubmit with correct arguments", async () => {
    const user = userEvent.setup();
    render(
      <MessageForm handleMessageFormSubmit={mockHandleMessageFormSubmit} />
    );

    const messageInput = screen.getByPlaceholderText(/write/i);
    const fileInput = screen.getByTestId("file");
    const submitButton = screen.getByTestId("submit");

    await user.type(messageInput, "Hello, World!");
    await user.upload(fileInput, file);
    await user.click(submitButton);

    expect(mockHandleMessageFormSubmit).toHaveBeenCalledWith(
      "Hello, World!",
      file
    );

    expect(mockHandleMessageFormSubmit).toHaveBeenCalledTimes(1);
  });
});
