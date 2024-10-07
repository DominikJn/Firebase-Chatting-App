import {
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  getFirestore,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import searchUser from "../../utils/searchUser";

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  startAt: vi.fn(),
  endAt: vi.fn(),
}));

const mockUsers = [
  { id: "1", name: "Alicent" },
  { id: "2", name: "Aemond" },
  { id: "3", name: "Aegon" },
  { id: "4", name: "Otto" },
  { id: "5", name: "Odrin" },
];

describe("searchUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch users by the first letters of their username regardless of case", async () => {
    // Mocking Firestore methods
    const mockCollection = vi.fn().mockReturnValue("mockCollectionRef");
    const mockQuery = vi.fn().mockReturnValue("mockQuery");

    const searchValue = "a"; // Case insensitive search should match "Alice"

    // Mock the returned query snapshot with the relevant user only
    getDocs.mockResolvedValue({
      docs: mockUsers
        .filter((user) => user.name.toLowerCase().startsWith(searchValue))
        .map((user) => ({
          id: user.id,
          data: () => ({ name: user.name }),
        })),
    });

    // Setup the collection, query, and mock return values
    collection.mockImplementation(mockCollection);
    query.mockImplementation(mockQuery);

    const resultOne = await searchUser(searchValue);

    // Expectations
    expect(resultOne).toEqual([
      { id: "1", name: "Alicent" },
      { id: "2", name: "Aemond" },
      { id: "3", name: "Aegon" },
    ]);

    // Check that Firestore functions were called correctly
    expect(collection).toHaveBeenCalledWith(db, "users");
    expect(query).toHaveBeenCalledWith(
      "mockCollectionRef",
      orderBy("name"),
      startAt(searchValue),
      endAt(searchValue + "\uf8ff")
    );
    expect(getDocs).toHaveBeenCalledWith("mockQuery");
  });
});
