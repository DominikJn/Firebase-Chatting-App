import UserData from "../../types/UserData";
import handleChatName from "../../utils/handleChatName";
import { testUsersArray } from "../mocks/testUsersArray";

describe("handleChatName", () => {
  it("should return chatName if provided", () => {
    const chatName: string = "Starks";
    const users: UserData[] = testUsersArray;

    const result = handleChatName(chatName, users);

    expect(result).toBe("Starks");
  });

  it("should return alternative chatName if not provided", () => {
    const chatName: string = "";
    const users: UserData[] = testUsersArray;

    const result = handleChatName(chatName, users);

    expect(result).toBe("Jon, Arya, Robb, Sansa, Bran, Rickon");
  });
});
