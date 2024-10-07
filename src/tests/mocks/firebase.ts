import { User } from "firebase/auth";

const mockAuth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback: (arg: User | null) => void) => {
    callback(mockAuth.currentUser);
  }),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve(mockAuth.currentUser)
  ),
  signOut: jest.fn(() => Promise.resolve()),
};

// Mock the firebase module
const mockFirebase = {
  auth: jest.fn(() => mockAuth),
};

export default mockFirebase
