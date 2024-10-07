import UserDocData from "../../types/UserDocData";

export const testUserDocData: UserDocData = {
  id: "1",
  name: "Jon Snow",
  email: "jon.snow@winterfell.com",
  friends: [{ name: "Samwell Tarly", id: "2" }],
  invites: [{ name: "Allister Thorn", id: "69" }, { name: "Janos Slynt", id: "70" }],
  lastSelectedChat: null,
};
