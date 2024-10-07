import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../../pages/DashboardPage";
import { store } from "../../store";
import { Provider } from "react-redux";
import {
  useAcceptInviteMutation,
  useDeleteFriendMutation,
  useGetUserQuery,
  useRejectInviteMutation,
  useUpdateUserMutation,
} from "../../features/api/userApi";
import {
  useAddChatMutation,
  useDeleteChatMutation,
  useGetChatByIdQuery,
  useGetUserChatsQuery,
} from "../../features/api/chatApi";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useUpdateUnseenByMutation,
  useUploadFileMutation,
} from "../../features/api/messageApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { testGroupChatData } from "../mocks/testChatData";
import { spammedTestMessages } from "../mocks/testMessages";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ChatList from "../../components/lists/ChatList";
import FriendList from "../../components/lists/FriendList";
import InviteList from "../../components/lists/InviteList";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const DashboardPageMock = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashboardPage />}>
            <Route path="/" element={<ChatList />} />
            <Route path="/friends" element={<FriendList />} />
            <Route path="/invites" element={<InviteList />} />
            <Route path="*" element={<ChatList />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("DashboardPage", () => {
  const sendMessage = vi.fn();
  const uploadFile = vi.fn();
  const updateUnseenBy = vi.fn();
  const updateUser = vi.fn();
  const deleteChat = vi.fn();
  const deleteFriend = vi.fn();
  const addChat = vi.fn();
  const acceptInvite = vi.fn();
  const rejectInvite = vi.fn();

  beforeEach(() => {
    //queries
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
    useGetUserChatsQuery.mockReturnValue({ data: [testGroupChatData] });
    useGetChatByIdQuery.mockReturnValue({ data: testGroupChatData });
    useGetChatMessagesQuery.mockReturnValue({ data: spammedTestMessages });
    //mutations
    sendMessage.mockResolvedValue({ data: { message: "She is muh queen!!" } });
    useSendMessageMutation.mockImplementation(() => [sendMessage]);
    useUploadFileMutation.mockImplementation(() => [uploadFile]);
    useUpdateUnseenByMutation.mockImplementation(() => [updateUnseenBy]);
    useUpdateUserMutation.mockImplementation(() => [updateUser]);
    useDeleteChatMutation.mockImplementation(() => [deleteChat]);
    useDeleteFriendMutation.mockImplementation(() => [deleteFriend]);
    useAddChatMutation.mockImplementation(() => [addChat]);
    useAcceptInviteMutation.mockImplementation(() => [acceptInvite]);
    useRejectInviteMutation.mockImplementation(() => [rejectInvite]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render components properly", () => {
    render(<DashboardPageMock />);

    const navbarElement = screen.getByRole("navigation");
    //default list rendered in '/' path
    const chatsListElement = screen.getByRole("heading", { name: "Chats" });

    expect(navbarElement).toBeInTheDocument();
    expect(chatsListElement).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  it("should switch main content based on current pathname", async () => {
    const user = userEvent.setup();
    render(<DashboardPageMock />);

    const icons = screen.getAllByRole("link");

    //shold be '/friends'
    await user.click(icons[1]);
    expect(
      screen.getByRole("heading", { name: "Friends" })
    ).toBeInTheDocument();

    //shold be '/invites'
    await user.click(icons[2]);
    expect(
      screen.getByRole("heading", { name: "Invites" })
    ).toBeInTheDocument();
  });
});
