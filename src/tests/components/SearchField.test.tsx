import React from "react";
import { render, screen } from "@testing-library/react";
import SearchField from "../../components/SearchField";
import { Provider } from "react-redux";
import { store } from "../../store";
import UserData from "../../types/UserData";
import userEvent from "@testing-library/user-event";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const SearchFieldMock = ({ searchedUser }: { searchedUser: UserData }) => {
  return (
    <Provider store={store}>
      <SearchField searchedUser={searchedUser} />
    </Provider>
  );
};

describe("SearchField", () => {
  const sendInvite = vi.fn();

  beforeEach(() => {
    setupRtkQueryMocks({
      sendInvite,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render searched user with friend plus button if user is not friend", async () => {
    render(
      <SearchFieldMock searchedUser={{ name: "Ramsay Bolton", id: "3" }} />
    );

    expect(screen.getByText(/Ramsay Bolton/i)).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("should render searched user with friend icon if user is friend", async () => {
    render(
      <SearchFieldMock searchedUser={{ name: "Samwell Tarly", id: "2" }} />
    );

    expect(screen.getByText(/Samwell Tarly/i)).toBeInTheDocument();
    expect(await screen.findByTestId("is-friend-icon")).toBeInTheDocument();
  });

  it("should call sendInvite mutation upon sending friend invitation", async () => {
    const user = userEvent.setup();
    render(
      <SearchFieldMock searchedUser={{ name: "Ramsay Bolton", id: "3" }} />
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(sendInvite).toHaveBeenCalledOnce();
  });
});
