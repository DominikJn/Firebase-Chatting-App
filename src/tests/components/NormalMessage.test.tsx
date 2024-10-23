import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NormalMessage from "../../components/chat/messages/NormalMessage";
import NormalMessageData from "../../types/message/NormalMessageData";
import { serverTimestamp } from "firebase/firestore";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MessageEditProvider } from "../../components/context/MessageEditContext";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";
import userEvent from "@testing-library/user-event";
import extractFirestoreFilePathFromUrl from "../../utils/extractFirestoreFilePathFromUrl";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/chatApi");
vi.mock("../../features/api/messageApi");

const NormalMessageMock = ({ message }: { message: NormalMessageData }) => {
  return (
    <Provider store={store}>
      <MessageEditProvider>
        <NormalMessage message={message} />
      </MessageEditProvider>
    </Provider>
  );
};

describe("NormalMessage", () => {
  const deleteMessage = vi.fn();
  const deleteFile = vi.fn();

  beforeEach(() => {
    setupRtkQueryMocks({
      deleteMessage,
      deleteFile,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const message: NormalMessageData = {
    id: "",
    user: "Jon Snow",
    userId: "1",
    createdAt: serverTimestamp(),
    type: "normal",
    text: "She is my queen!!!",
    file: {
      url: "https://firebasestorage.googleapis.com/v0/b/random-bucket/o/files%2Fexample%2Fimage.png?alt=media&token=some-token",
      type: "image/jpeg",
    },
  };

  it("should render message text", () => {
    render(<NormalMessageMock message={message} />);

    const divElement = screen.getByText(/she is my queen!!!/i);

    expect(divElement).toBeInTheDocument();
  });

  it("should contain file if there is one", () => {
    render(<NormalMessageMock message={message} />);

    //find file by file extension as it is always displayed
    const spanElement = screen.getByTestId(/file/i);

    expect(spanElement).toBeInTheDocument();
  });

  it("should call deleteMessage mutation and conditionally deleteFile mutation if there is a file", async () => {
    const user = userEvent.setup();
    render(<NormalMessageMock message={message} />);

    // Simulate mouse over (hover)
    fireEvent.mouseEnter(screen.getByTestId("message"));
    //click button after parent element hover
    await user.click(screen.getByTestId(`delete-message-${message.id}`));

    expect(deleteMessage).toHaveBeenCalledWith({
      chatId: "",
      messageId: message.id,
    });

    const path: string = extractFirestoreFilePathFromUrl(message!.file!.url);
    expect(deleteFile).toHaveBeenCalledWith(path);
  });
});
