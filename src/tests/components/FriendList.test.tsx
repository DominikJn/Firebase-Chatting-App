import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import {
  useDeleteChatMutation,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";
import {
  useDeleteFriendMutation,
  useGetUserQuery,
} from "../../features/api/userApi";
import { testUserDocData } from "../mocks/testUserDocData";
import FriendList from "../../components/lists/FriendList";
import { testGroupChatData, testSingleChatData } from "../mocks/testChatData";
import userEvent from "@testing-library/user-event";

vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/userApi");

const FriendListMock = () => {
  return (
    <Provider store={store}>
      <FriendList />
    </Provider>
  );
};

describe("FriendList", () => {
  const deleteChat = vi.fn();
  const deleteFriend = vi.fn();

  beforeEach(() => {
    useGetUserChatsQuery.mockReturnValue({
      data: [testGroupChatData, testSingleChatData],
    });
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
    useDeleteChatMutation.mockImplementation(() => [deleteChat]);
    useDeleteFriendMutation.mockImplementation(() => [deleteFriend]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chats in form of list", () => {
    render(<FriendListMock />);

    testUserDocData.friends.forEach((friend) => {
      expect(screen.getByText(friend.name)).toBeInTheDocument();
    });
  });

  it("should delete friend from list on button click", async () => {
    const user = userEvent.setup();
    render(<FriendListMock />);

    const deleteButton = screen.getByText(/x/i);
    await user.click(deleteButton);

    expect(deleteChat).toHaveBeenCalledWith("332211");
    expect(deleteFriend).toHaveBeenCalledWith({
      friend: testUserDocData.friends[0],
      chatId: "332211",
    });
  });
});
