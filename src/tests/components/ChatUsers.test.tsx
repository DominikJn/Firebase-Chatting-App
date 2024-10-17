import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import ChatUsers from "../../components/chat/ChatUsers";
import { testGroupChatData } from "../mocks/testChatData";
import { setupRtkQueryMocks } from "../mocks/rtkQueryHooks";
import { testUsersArray } from "../mocks/testUsersArray";

vi.mock("../../features/api/userApi");
vi.mock("../../features/api/messageApi");
vi.mock("../../features/api/chatApi");

vi.mock("firebase/firestore", () => {
  return {
    serverTimestamp: vi.fn().mockImplementation(() => {
      return {
        toDate: () => new Date("2024-01-01T00:00:00Z"), // Example fixed date
      };
    }),
    getFirestore: vi.fn(), // Mock the getFirestore function
  };
});

const ChatUsersMock = ({ userIds }: { userIds: string[] }) => {
  return (
    <Provider store={store}>
      <ChatUsers userIds={userIds} />
    </Provider>
  );
};

describe("ChatUsers", () => {
  beforeEach(() => {
    setupRtkQueryMocks();
  });

  it("should render list of users with their activity status", () => {
    render(<ChatUsersMock userIds={testGroupChatData.users} />);

    testUsersArray.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument();

      if (user.status?.isActive) {
        //check if activer user has green dot
        expect(screen.getByTestId(`list-element-${user.name}`)).toHaveClass(
          /bg-green/i
        );
      } else {
        //check if activer user has slate dot
        expect(screen.getByTestId(`list-element-${user.name}`)).toHaveClass(
          /bg-slate/i //check if activer user has slate dot
        );
        //check if inactive user has text telling inactive time
        expect(
          screen.getByTestId(`inactive-for-${user.name}`)
        ).toBeInTheDocument();
      }
    });
  });
});
