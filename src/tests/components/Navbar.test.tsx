import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import Navbar from "../../components/Navbar";
import { useGetUserQuery } from "../../features/api/userApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { testSingleChatData } from "../mocks/testChatData";
import { useGetUserChatsQuery } from "../../features/api/chatApi";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/chatApi");

const NavbarMock = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Navbar />
      </Provider>
    </BrowserRouter>
  );
};

describe("Navbar", () => {
  beforeEach(() => {
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
    useGetUserChatsQuery.mockReturnValue({ data: [testSingleChatData] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render links correctly", () => {
    render(<NavbarMock />);

    const icons = screen.getAllByRole("link");

    expect(icons).toHaveLength(3);
    expect(icons[0]).toHaveAttribute("href", "/");
    expect(icons[1]).toHaveAttribute("href", "/friends");
    expect(icons[2]).toHaveAttribute("href", "/invites");
  });

  it("should highlight chats and invitations icons when there are unseen things", async () => {
    render(<NavbarMock />);

    const chatsHighlightElement = await screen.findByTestId("chats-highlight");
    const invitesHighlightElement = await screen.findByTestId(
      "invites-highlight"
    );

    expect(chatsHighlightElement).toBeInTheDocument();
    expect(invitesHighlightElement).toBeInTheDocument();
    expect(invitesHighlightElement).toHaveTextContent("2");
  });
});
