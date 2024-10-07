import React from "react";
import { render, screen } from "@testing-library/react";
import ChatList from "../../components/lists/ChatList";
import { Provider } from "react-redux";
import { store } from "../../store";
import {
  useAddChatMutation,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";
import { testGroupChatData, testSingleChatData } from "../mocks/testChatData";
import ChatData from "../../types/chat/ChatData";
import userEvent from "@testing-library/user-event";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../features/api/userApi";
import { testUserDocData } from "../mocks/testUserDocData";

vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/userApi");

const ChatListMock = () => {
  return (
    <Provider store={store}>
      <ChatList />
    </Provider>
  );
};

describe("ChatList", () => {
  const addChat = vi.fn();
  const updateUser = vi.fn();
  const chatsArray: ChatData[] = [testGroupChatData, testSingleChatData];

  beforeEach(() => {
    useGetUserChatsQuery.mockReturnValue({
      data: chatsArray,
    });
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
    useAddChatMutation.mockImplementation(() => [addChat]);
    useUpdateUserMutation.mockImplementation(() => [updateUser]);
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
