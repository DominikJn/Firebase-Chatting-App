import React from "react";
import { render, screen } from "@testing-library/react";
import CreateGroupModal from "../../components/modals/CreateGroupModal";
import { Provider } from "react-redux";
import { store } from "../../store";
import { useGetUserQuery } from "../../features/api/userApi";
import { useAddChatMutation } from "../../features/api/chatApi";
import { testUserDocData } from "../mocks/testUserDocData";
import { testUsersArray } from "../mocks/testUsersArray";
import userEvent from "@testing-library/user-event";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/chatApi");

const CreateGroupModalMock = ({
  setModalOpen,
}: {
  setModalOpen: (arg: boolean) => void;
}) => {
  return (
    <Provider store={store}>
      <CreateGroupModal setModalOpen={setModalOpen} />
    </Provider>
  );
};

describe("CreateGroupModal", () => {
  const setModalOpen = vi.fn();
  const addChat = vi.fn();

  beforeEach(() => {
    useGetUserQuery.mockReturnValue({
      data: { ...testUserDocData, friends: testUsersArray },
    });
    useAddChatMutation.mockImplementation(() => [addChat]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render list of all user friends", () => {
    render(<CreateGroupModalMock setModalOpen={setModalOpen} />);

    testUsersArray.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument();
    });
  });

  it("should render list of matching friends after typing something in input", async () => {
    const user = userEvent.setup();
    render(<CreateGroupModalMock setModalOpen={setModalOpen} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    expect(screen.getByText(/sansa/i)).toBeInTheDocument();
    expect(screen.getByText(/bran/i)).toBeInTheDocument();
    expect(screen.getByText(/arya/i)).toBeInTheDocument();
  });

  it("should move clicked friends to  list of chosen friends", async () => {
    const user = userEvent.setup();
    render(<CreateGroupModalMock setModalOpen={setModalOpen} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "a");

    const friendButton = screen.getByTestId(/add-sansa/i);
    await user.click(friendButton);

    //chosen friends
    expect(await screen.findByTestId(/delete-sansa/i)).toBeInTheDocument();
    //unchosen friends
    expect(await screen.findByTestId(/add-arya/i)).toBeInTheDocument();
    expect(await screen.findByTestId(/add-bran/i)).toBeInTheDocument();
  });

  it("should call handleGroupCreation function when submitted", async () => {
    const user = userEvent.setup();
    render(<CreateGroupModalMock setModalOpen={setModalOpen} />);

    const submitButton = screen.getByTestId("submit");
    await user.click(submitButton);

    expect(addChat).toHaveBeenCalledTimes(1);
  });

  it("should call setModalOpen function with false argument", async () => {
    const user = userEvent.setup();
    render(<CreateGroupModalMock setModalOpen={setModalOpen} />);

    const closeButton = screen.getByTestId("close");
    await user.click(closeButton);

    expect(setModalOpen).toBeCalledWith(false);
  });
});
