import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";
import { Provider } from "react-redux";
import { store } from "../../store";
import { BrowserRouter } from "react-router-dom";
import { useGetUserQuery } from "../../features/api/userApi";
import userEvent from "@testing-library/user-event";
import { testUserDocData } from "../mocks/testUserDocData";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

const HeaderMock = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Header />
      </Provider>
    </BrowserRouter>
  );
};

describe("Header", () => {
  const updateUser = vi.fn();

  beforeEach(() => {
    setupRtkQueryMocks({
      updateUser,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render user data with logout button if authenticated", () => {
    render(<HeaderMock />);

    expect(screen.getByText(/Jon Snow/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("should render sign in / sign up buttons if not authenticated", () => {
    //overwrite getUserQueryMock to return null when not authenticated
    useGetUserQuery.mockReturnValue({ data: null });

    render(<HeaderMock />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("should call updateUser when logout button is clicked", async () => {
    render(<HeaderMock />);

    const logoutButton = screen.getByText(/Logout/i);
    const user = userEvent.setup();
    await user.click(logoutButton);

    expect(updateUser).toHaveBeenCalledWith(testUserDocData);
  });
});
