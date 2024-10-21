import React from "react";
import { render, screen } from "@testing-library/react";
import NormalMessage from "../../components/chat/messages/NormalMessage";
import NormalMessageData from "../../types/message/NormalMessageData";
import { serverTimestamp } from "firebase/firestore";
import { Provider } from "react-redux";
import { store } from "../../store";
import { useGetUserQuery } from "../../features/api/userApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { MessageEditProvider } from "../../components/context/MessageEditContext";

vi.mock("../../features/api/userApi");

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
  const message: NormalMessageData = {
    id: "",
    user: "Jon Snow",
    userId: "1",
    createdAt: serverTimestamp(),
    type: "normal",
    text: "She is my queen!!!",
    file: {
      url: "test.jpg",
      type: "image/jpeg",
    },
  };

  beforeEach(() => {
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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
});
