import React from "react";
import { render, screen } from "@testing-library/react";
import ChatShortcut from "../../components/lists/ChatShortcut";
import { testGroupChatData } from "../mocks/testChatData";
import { testUserDocData } from "../mocks/testUserDocData";
import ChatData from "../../types/chat/ChatData";
import { Provider } from "react-redux";
import { store } from "../../store";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const ChatShortcutMock = ({ chat }: { chat: ChatData }) => {
  return (
    <Provider store={store}>
      <ChatShortcut chat={chat} />
    </Provider>
  );
};

describe("ChatShortcut", () => {
  beforeEach(() => {
    setupRtkQueryMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chatName, matching icon and last message", () => {
    render(<ChatShortcutMock chat={testGroupChatData} />);

    expect(screen.getByText(testGroupChatData.chatName)).toBeInTheDocument();
    expect(screen.getByTestId(/group/i)).toBeInTheDocument();
    expect(screen.getByText(testGroupChatData.lastMessage)).toBeInTheDocument();
  });

  it("should render unseen chat properties if user has not seen new messages", () => {
    render(
      <ChatShortcutMock
        chat={{ ...testGroupChatData, unseenBy: [testUserDocData.id] }}
      />
    );

    expect(screen.getByTestId(/unseen/i)).toBeInTheDocument();
    expect(screen.getByTestId("container")).toHaveClass("font-bold");
  });

  it("should not render unseen chat properties if user has seen new messages", () => {
    render(
      <ChatShortcutMock
        chat={{ ...testGroupChatData, unseenBy: ["somerandomshit"] }}
      />
    );

    expect(screen.getByTestId("container")).not.toHaveClass("font-bold");
  });

  it("should render green dot if some of the users are active", () => {
    render(<ChatShortcutMock chat={testGroupChatData} />);

    const greenDotElement = screen.getByTestId("active-dot");

    expect(greenDotElement).toBeInTheDocument();
  });
});
