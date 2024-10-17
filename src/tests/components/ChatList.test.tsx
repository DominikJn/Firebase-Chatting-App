import React from "react";
import { render, screen } from "@testing-library/react";
import ChatList from "../../components/lists/ChatList";
import { Provider } from "react-redux";
import { store } from "../../store";
import { testGroupChatData, testSingleChatData } from "../mocks/testChatData";
import ChatData from "../../types/chat/ChatData";
import userEvent from "@testing-library/user-event";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const ChatListMock = () => {
  return (
    <Provider store={store}>
      <ChatList />
    </Provider>
  );
};

describe("ChatList", () => {
  const chatsArray: ChatData[] = [testGroupChatData, testSingleChatData];

  beforeEach(() => {
    setupRtkQueryMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chats in form of list", () => {
    render(<ChatListMock />);

    chatsArray.forEach((chat) => {
      expect(screen.getByText(chat.chatName)).toBeInTheDocument();
    });
  });

  it("should render group creation modal after button click", async () => {
    const user = userEvent.setup();
    render(<ChatListMock />);

    const button = screen.getByRole("button", { name: /create/i });
    await user.click(button);

    expect(await screen.findByTestId("modal")).toBeVisible();
  });
});
