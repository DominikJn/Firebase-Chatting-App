import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import ChatOptions from "../../components/chat/ChatOptions";
import ChatData from "../../types/chat/ChatData";
import { testUsersArray } from "../mocks/testUsersArray";
import { serverTimestamp } from "firebase/firestore";
import { useGetUserQuery } from "../../features/api/userApi";
import { useUpdateChatNameMutation } from "../../features/api/chatApi";
import { useSendMessageMutation } from "../../features/api/messageApi";
import userEvent from "@testing-library/user-event";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/messageApi");

const ChatOptionsMock = ({ chat }: { chat: ChatData }) => {
  return (
    <Provider store={store}>
      <ChatOptions chat={chat} />
    </Provider>
  );
};

describe("ChatOptions", () => {
  const chat: ChatData = {
    id: "123",
    userIds: ["2"],
    users: testUsersArray,
    admins: ["2"],
    unseenBy: ["2"],
    type: "group",
    chatName: "Robb & Jon",
    lastMessage: "Winter is coming Jon!",
    lastMessageTimestamp: serverTimestamp(),
  };

  const sendMessage = vi.fn();
  const updateChatName = vi.fn();

  //mock value for every case where user is admin
  beforeEach(() => {
    useGetUserQuery.mockReturnValue({ data: { name: "Robb Stark", id: "2" } });
    useSendMessageMutation.mockImplementation(() => [sendMessage]);
    useUpdateChatNameMutation.mockImplementation(() => [updateChatName]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chat settings if user is in admin array", () => {
    render(<ChatOptionsMock chat={chat} />);

    expect(screen.getByText(/chat options/i)).toBeInTheDocument();
  });

  it("should call mutations after form submition", async () => {
    render(<ChatOptionsMock chat={chat} />);

    const input = screen.getByRole("textbox");
    const user = userEvent.setup();

    await user.type(input, "New Chat Name");
    await user.type(input, "{enter}");

    expect(updateChatName).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it("should render authorization message if user is NOT in admin array", () => {
    useGetUserQuery.mockReturnValue({ data: { name: "Jon Snow", id: "1" } });

    render(<ChatOptionsMock chat={chat} />);

    expect(screen.getByText(/you have no access/i)).toBeInTheDocument();
  });
});
