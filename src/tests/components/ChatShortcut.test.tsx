import React from "react";
import { render, screen } from "@testing-library/react";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../features/api/userApi";
import ChatShortcut from "../../components/lists/ChatShortcut";
import { testGroupChatData } from "../mocks/testChatData";
import { testUserDocData } from "../mocks/testUserDocData";
import ChatData from "../../types/chat/ChatData";
import { Provider } from "react-redux";
import { store } from "../../store";

vi.mock("../../features/api/userApi");

const ChatShortcutMock = ({ chat }: { chat: ChatData }) => {
  return (
    <Provider store={store}>
      <ChatShortcut chat={chat} />
    </Provider>
  );
};

describe("ChatShortcut", () => {
  const updateUser = vi.fn();

  beforeEach(() => {
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
    useUpdateUserMutation.mockImplementation(() => [updateUser]);
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

  it("should call updateUser mutation before page reload", () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, "location", {
      value: {
        reload: mockReload,
      },
      writable: true,
    });
    // Mock addEventListener
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    // Mock addEventListener
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <ChatShortcutMock
        chat={{ ...testGroupChatData, unseenBy: ["somerandomshit"] }}
      />
    );
    //simulate page refresh
    window.location.reload();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    //unmount the component to call clean up function
    unmount();
    //expect clean up function to have been called
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );

    // Clean up the mocks
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
