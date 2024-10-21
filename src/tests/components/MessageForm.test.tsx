import React from "react";
import { render, screen } from "@testing-library/react";
import MessageForm from "../../components/chat/MessageForm";
import userEvent from "@testing-library/user-event";
import { MessageEditContext } from "../../components/context/MessageEditContext";
import { Provider } from "react-redux";
import { store } from "../../store";
import {
  mockSelectedMessageValue,
  mockUnselectedMessageValue,
} from "../mocks/mockMessageEditProviderValue";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const MessageFormMock = ({
  handleMessageFormSubmit,
  mockMessageEditProviderValue,
}: {
  handleMessageFormSubmit: (message: string, file: File) => Promise<void>;
  mockMessageEditProviderValue: typeof mockUnselectedMessageValue;
}) => {
  return (
    <Provider store={store}>
      <MessageEditContext.Provider value={mockMessageEditProviderValue}>
        <MessageForm handleMessageFormSubmit={handleMessageFormSubmit} />
      </MessageEditContext.Provider>
    </Provider>
  );
};

describe("MessageForm", () => {
  const editMessage = vi.fn();

  global.URL.createObjectURL = vi.fn();
  const mockHandleMessageFormSubmit = vi.fn().mockResolvedValue(undefined);

  const file = new File(["hello"], "hello.png", { type: "image/png" });

  beforeEach(() => {
    setupRtkQueryMocks({
      editMessage,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render form correctly", () => {
    render(
      <MessageFormMock
        handleMessageFormSubmit={mockHandleMessageFormSubmit}
        mockMessageEditProviderValue={mockUnselectedMessageValue}
      />
    );

    const messageInput = screen.getByPlaceholderText(/write/i);
    const fileInput = screen.getByTestId("file");
    const sendButton = screen.getByTestId("submit");

    expect(messageInput).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it("should render view of chosen files", async () => {
    const user = userEvent.setup();
    render(
      <MessageFormMock
        handleMessageFormSubmit={mockHandleMessageFormSubmit}
        mockMessageEditProviderValue={mockUnselectedMessageValue}
      />
    );

    const fileInput = screen.getByTestId("file");
    await user.upload(fileInput, file);

    const fileView = await screen.findByTestId("file-view");
    expect(fileView).toBeInTheDocument();
  });

  it("should call a handleMessageFormSubmit with correct arguments", async () => {
    const user = userEvent.setup();
    render(
      <MessageFormMock
        handleMessageFormSubmit={mockHandleMessageFormSubmit}
        mockMessageEditProviderValue={mockUnselectedMessageValue}
      />
    );

    const messageInput = screen.getByPlaceholderText(/write/i);
    const fileInput = screen.getByTestId("file");
    const submitButton = screen.getByTestId("submit");

    await user.type(messageInput, "Hello, World!");
    await user.upload(fileInput, file);
    await user.click(submitButton);

    expect(mockHandleMessageFormSubmit).toHaveBeenCalledWith(
      "Hello, World!",
      file
    );
  });

  it("should call editMessage mutation after submit of edited message when one is selected", async () => {
    const user = userEvent.setup();
    render(
      <MessageFormMock
        handleMessageFormSubmit={mockHandleMessageFormSubmit}
        mockMessageEditProviderValue={mockSelectedMessageValue}
      />
    );

    const messageInput = screen.getByPlaceholderText(/write/i);
    const submitButton = screen.getByTestId("submit");

    const editedMessage: string = "This is value of edited message!";
    await user.type(messageInput, editedMessage);
    await user.click(submitButton);

    expect(editMessage).toHaveBeenCalledWith({
      chatId: "",
      message: {
        ...mockSelectedMessageValue.selectedMessageToEdit,
        isEdited: true,
        text: editedMessage,
      },
    });
  });
});
