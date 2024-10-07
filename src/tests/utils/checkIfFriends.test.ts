import UserDocData from "../../types/UserDocData";
import checkIfFriends from "../../utils/checkIfFriends";

describe("checkIfFriends", () => {
  const user: UserDocData = {
    id: "1",
    name: "Jon Snow",
    email: "jonsnow@winterfell.com",
    friends: [{ id: "2", name: "Samwell Tarly" }],
    invites: [],
    lastSelectedChat: null,
  };

  it("should return true if user friends array contains searched user", () => {
    const searchedUser = { name: "Samwell Tarly", id: "2" };

    const result = checkIfFriends(user, searchedUser.id);

    expect(result).toBe(true);
  });

  it("should return false if user friends array doesnt contain searched user", () => {
    const searchedUser = { name: "Samwell Tarly", id: "3" };

    const result = checkIfFriends(user, searchedUser.id);

    expect(result).toBe(false);
  });

  it("should return true if searched user ID is current user iD", () => {
    const searchedUser = { name: "Jon Snow", id: "1" };

    const result = checkIfFriends(user, searchedUser.id);

    expect(result).toBe(true);
  });
});
