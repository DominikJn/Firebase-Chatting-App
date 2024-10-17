import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import { useGetUsersActivityStatusQuery } from "../../features/api/userApi";
import FriendList from "../../components/lists/FriendList";
import userEvent from "@testing-library/user-event";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";
import { testUsersArray } from "../mocks/testUsersArray";
import { testUserDocData } from "../mocks/testUserDocData";
import UserData from "../../types/UserData";

vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/messageApi");
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

  const fetchedFriends: UserData[] = testUsersArray.filter((user) =>
    testUserDocData.friends.includes(user.id)
  );
  console.log(fetchedFriends);

  beforeEach(() => {
    setupRtkQueryMocks({
      deleteChat,
      deleteFriend,
    });
    // manually return user with ID === 2
    useGetUsersActivityStatusQuery.mockReturnValue({
      data: fetchedFriends,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chats in form of list", () => {
    render(<FriendListMock />);

    fetchedFriends.forEach((friend) => {
      expect(screen.getByText(friend?.name)).toBeInTheDocument();
    });
  });

  it("should render green activity dot if user is active", () => {
    render(<FriendListMock />);

    fetchedFriends.forEach((friend) => {
      if (friend.status?.isActive) {
        expect(
          screen.getByTestId(`active-dot-friend-${friend.name}`)
        ).toBeInTheDocument();
      }
    });
  });

  it("should delete friend from list on button click", async () => {
    const user = userEvent.setup();
    render(<FriendListMock />);

    const deleteButton = screen.getAllByText(/x/i);
    //click the button of jon's first in array friend
    await user.click(deleteButton[0]);

    expect(deleteChat).toHaveBeenCalledWith("332211");
    expect(deleteFriend).toHaveBeenCalledWith({
      friendId: testUsersArray[0].id,
      chatId: "332211",
    });
  });
});
