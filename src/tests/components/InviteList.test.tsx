import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import {
  useAddChatMutation,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";
import {
  useAcceptInviteMutation,
  useGetUserQuery,
  useRejectInviteMutation,
} from "../../features/api/userApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { testGroupChatData, testSingleChatData } from "../mocks/testChatData";
import userEvent from "@testing-library/user-event";
import InviteList from "../../components/lists/InviteList";

vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/userApi");

const InviteListMock = () => {
  return (
    <Provider store={store}>
      <InviteList />
    </Provider>
  );
};

describe("InviteList", () => {
  const acceptInvite = vi.fn();
  const rejectInvite = vi.fn();
  const addChat = vi.fn();

  beforeEach(() => {
    useGetUserChatsQuery.mockReturnValue({
      data: [testGroupChatData, testSingleChatData],
    });
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
    useAcceptInviteMutation.mockImplementation(() => [acceptInvite]);
    useRejectInviteMutation.mockImplementation(() => [rejectInvite]);
    useAddChatMutation.mockImplementation(() => [addChat]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chats in form of list", () => {
    render(<InviteListMock />);

    testUserDocData.invites.forEach((friend) => {
      expect(screen.getByText(friend.name)).toBeInTheDocument();
    });
  });

  it("should add inviting user to friends on accept", async () => {
    const user = userEvent.setup();
    render(<InviteListMock />);

    const acceptButtons = screen.getAllByText(/y/i);
    await user.click(acceptButtons[0]);

    expect(acceptInvite).toHaveBeenCalledWith(testUserDocData.invites[0]);
    expect(addChat).toHaveBeenCalled();

    // Mock the updated query result to simulate the UI after mutation
    useGetUserQuery.mockReturnValue({
      data: { ...testUserDocData, invites: [testUserDocData.invites[1]] },
    });

    const { data } = useGetUserQuery();
    expect(data?.invites.length).toBe(1);
  });

  it("should remove inviting user from invites on reject", async () => {
    const user = userEvent.setup();
    render(<InviteListMock />);

    const rejectButtons = screen.getAllByText(/x/i);
    await user.click(rejectButtons[0]);

    expect(rejectInvite).toHaveBeenCalledWith(testUserDocData.invites[0]);

    // Mock the updated query result to simulate the UI after mutation
    useGetUserQuery.mockReturnValue({
      data: { ...testUserDocData, invites: [testUserDocData.invites[1]] },
    });

    const { data } = useGetUserQuery();
    expect(data?.invites.length).toBe(1);
  });
});
