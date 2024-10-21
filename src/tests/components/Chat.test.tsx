import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Chat from "../../components/chat/Chat";
import { store } from "../../store";
import { useGetChatMessagesQuery } from "../../features/api/messageApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { testGroupChatData } from "../mocks/testChatData";
import { spammedTestMessages } from "../mocks/testMessages";
import userEvent from "@testing-library/user-event";
import { serverTimestamp } from "firebase/firestore";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";
import { MessageEditProvider } from "../../components/context/MessageEditContext";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const ChatMock = () => {
  return (
    <Provider store={store}>
      <MessageEditProvider>
        <Chat />
      </MessageEditProvider>
    </Provider>
  );
};

describe("Chat", () => {
  const sendMessage = vi.fn();
  const uploadFile = vi.fn();

  global.URL.createObjectURL = vi.fn();
  const file = new File(["hello"], "hello.png", { type: "image/png" });

  beforeEach(() => {
    setupRtkQueryMocks({
      sendMessage,
      uploadFile,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render child components properly", () => {
    render(<ChatMock />);

    const chatHeaderComponent = screen.getByText(testGroupChatData.chatName);
    const messageContainerComponent = screen.getByTestId("chatContainer");
    const messageFormComponent = screen.getByPlaceholderText(/write/i);

    expect(chatHeaderComponent).toBeInTheDocument();
    expect(messageContainerComponent).toBeInTheDocument();
    expect(messageFormComponent).toBeInTheDocument();
  });

  it("should handle message sending and displaying properly", async () => {
    const user = userEvent.setup();
    render(<ChatMock />);

    const messageInput = screen.getByPlaceholderText(/write/i);
    const sendMessageButton = screen.getByTestId(/submit/i);

    await user.type(messageInput, "She is muh queen!!");
    await user.click(sendMessageButton);

    const newMessage = {
      id: "",
      createdAt: serverTimestamp(),
      text: "She is muh queen!!",
      type: "normal",
      user: testUserDocData.name,
      userId: testUserDocData.id,
    };

    expect(sendMessage).toHaveBeenCalledWith({
      message: newMessage,
      chatId: testGroupChatData.id,
    });

    // Mock the updated query result to simulate the UI after mutation
    useGetChatMessagesQuery.mockReturnValue({
      data: [...spammedTestMessages, newMessage],
    });

    // Re-render the component
    render(<ChatMock />);

    // Check that the new message is now in the DOM
    expect(await screen.findByText(newMessage.text)).toBeInTheDocument();
  });

  it("should handle file sending and displaying", async () => {
    const user = userEvent.setup();
    render(<ChatMock />);

    const fileInput = screen.getByTestId("file");
    const sendMessageButton = screen.getByTestId(/submit/i);

    await user.upload(fileInput, file);
    await user.click(sendMessageButton);

    const newMessage = {
      createdAt: serverTimestamp(),
      text: "File Description",
      type: "normal",
      user: testUserDocData.name,
      userId: testUserDocData.id,
      file,
    };

    expect(uploadFile).toHaveBeenCalled();

    // Mock the updated query result to simulate the UI after mutation
    useGetChatMessagesQuery.mockReturnValue({
      data: [...spammedTestMessages, newMessage],
    });

    // Re-render the component
    render(<ChatMock />);

    // Check that the new message with file is now in the DOM
    expect(await screen.findByTestId("file-message")).toBeInTheDocument();
  });
});
