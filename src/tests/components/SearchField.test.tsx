import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SearchField from "../../components/SearchField";
import { useGetUserQuery } from "../../features/api/userApi";
import { Provider } from "react-redux";
import { store } from "../../store";
import { testUserDocData } from "../mocks/testUserDocData";
import UserData from "../../types/UserData";

vi.mock("../../features/api/userApi");

const SearchFieldMock = ({ searchedUser }: { searchedUser: UserData }) => {
  return (
    <Provider store={store}>
      <SearchField searchedUser={searchedUser} />
    </Provider>
  );
};

describe("SearchField", () => {
  beforeEach(() => {
    useGetUserQuery.mockReturnValue({ data: testUserDocData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render searched user with friend plus button if user is not friend", async () => {
    render(
      <SearchFieldMock searchedUser={{ name: "Ramsay Bolton", id: "3" }} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Ramsay Bolton/i)).toBeInTheDocument();
      expect(screen.getByText("+")).toBeInTheDocument();
    });
  });

  it("should render searched user with friend icon if user is friend", async () => {
    const { container } = render(
      <SearchFieldMock searchedUser={{ name: "Samwell Tarly", id: "2" }} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Samwell Tarly/i)).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
