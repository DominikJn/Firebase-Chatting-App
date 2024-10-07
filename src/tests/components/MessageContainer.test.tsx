import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MessageContainer from "../../components/chat/MessageContainer";
import { Provider } from "react-redux";
import { store } from "../../store";
import { useGetChatMessagesQuery } from "../../features/api/messageApi";
import { useGetUserQuery } from "../../features/api/userApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { spammedTestMessages, testMessages } from "../mocks/testMessages";

vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/userApi");

const MessageContainerMock = () => {
  return (
    <Provider store={store}>
      <MessageContainer />
    </Provider>
  );
};

describe("MessageContainer", () => {
  beforeEach(() => {
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render messages of both config and normal types", () => {
    useGetChatMessagesQuery.mockReturnValue({ data: testMessages });

    render(<MessageContainerMock />);

    testMessages.forEach((message) => {
      if (message.type === "config") {
        expect(screen.getByText(message.text)).toBeInTheDocument();
      } else {
        //expect Robb Stark to be displayed in other user's message as the logged user here is Jon Snow
        expect(screen.getByText(/Robb Stark/i)).toBeInTheDocument();
        expect(screen.getByText(message.text)).toBeInTheDocument();
      }
    });
  });

  it("should display scroll down icon when user scrolls above certain limit of conversation", async () => {
    useGetChatMessagesQuery.mockReturnValue({ data: spammedTestMessages });
    render(<MessageContainerMock />);

    expect(screen.queryByTestId("scrollDownButton")).not.toBeInTheDocument();

    const chatContainer = screen.getByTestId("chatContainer");
    // Mock the scrollHeight and clientHeight properties to simulate overflow-y
    Object.defineProperty(chatContainer, "scrollHeight", { value: 1600 });
    Object.defineProperty(chatContainer, "clientHeight", { value: 800 });
    //fire scvroll event
    fireEvent.scroll(chatContainer, { target: { scrollTop: 600 } });

    const scrollDownButton = await screen.findByTestId("scrollDownButton");
    expect(scrollDownButton).toBeInTheDocument();
  });
});
