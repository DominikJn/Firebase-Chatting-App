import React from "react";
import { render, screen } from "@testing-library/react";
import ChatHeader from "../../components/chat/ChatHeader";
import userEvent from "@testing-library/user-event";

describe("ChatHeader", () => {
  const handleChatOptionsToggle = () => vi.fn();

  test("should render chat name", () => {
    render(
      <ChatHeader
        chatName="Friends!!!"
        areOptionsActive={false}
        toggleChatOptions={handleChatOptionsToggle}
      />
    );

    const chatNameElement = screen.getByText(/Friends!!!/i);

    expect(chatNameElement).toBeInTheDocument();
  });

  test("should render settings icon by default", async () => {
    render(
      <ChatHeader
        chatName="Friends!!!"
        areOptionsActive={false}
        toggleChatOptions={handleChatOptionsToggle}
      />
    );

    expect(screen.getByTestId("settings")).toBeInTheDocument();
  });

  test("should render arrow back icon when areOptionsActive is true", async () => {
    render(
      <ChatHeader
        chatName="Friends!!!"
        areOptionsActive={true}
        toggleChatOptions={handleChatOptionsToggle}
      />
    );

    expect(screen.getByTestId("back")).toBeInTheDocument();
  });
});
