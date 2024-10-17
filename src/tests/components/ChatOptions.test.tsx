import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import ChatOptions from "../../components/chat/ChatOptions";
import ChatData from "../../types/chat/ChatData";
import { useGetUserQuery } from "../../features/api/userApi";
import userEvent from "@testing-library/user-event";
import { testGroupChatData } from "../mocks/testChatData";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/messageApi");

vi.mock("firebase/firestore", () => {
  return {
    serverTimestamp: vi.fn().mockImplementation(() => {
      return {
        toDate: () => new Date("2024-01-01T00:00:00Z"), // Example fixed date
      };
    }),
    getFirestore: vi.fn(), // Mock the getFirestore function
  };
});

const ChatOptionsMock = ({ chat }: { chat: ChatData }) => {
  return (
    <Provider store={store}>
      <ChatOptions chat={chat} />
    </Provider>
  );
};

describe("ChatOptions", () => {
  const sendMessage = vi.fn();
  const updateChatName = vi.fn();

  //mock value for every case where user is admin
  beforeEach(() => {
    setupRtkQueryMocks({
      sendMessage,
      updateChatName,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render chat settings if user is in admin array", () => {
    render(<ChatOptionsMock chat={testGroupChatData} />);

    expect(screen.getByText(/chat options/i)).toBeInTheDocument();
  });

  it("should call mutations after form submition", async () => {
    render(<ChatOptionsMock chat={testGroupChatData} />);

    const input = screen.getByRole("textbox");
    const user = userEvent.setup();

    await user.type(input, "New Chat Name");
    await user.type(input, "{enter}");

    expect(updateChatName).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it("should render authorization message if user is NOT in admin array", () => {
    useGetUserQuery.mockReturnValue({
      data: { name: "Jon Snow", id: "noAccessRandomId" },
    });

    render(<ChatOptionsMock chat={testGroupChatData} />);

    expect(screen.getByText(/you have no access/i)).toBeInTheDocument();
  });
});
