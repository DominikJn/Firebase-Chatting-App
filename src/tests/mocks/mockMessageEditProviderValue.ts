import { serverTimestamp } from "firebase/firestore";
import NormalMessageData from "../../types/message/NormalMessageData";

interface MockMessageEditProviderValue {
  selectedMessageToEdit: NormalMessageData | null;
  editMessage: (message: NormalMessageData) => void;
  clearSelectedMessageToEdit: () => void;
}

export const mockSelectedMessageValue: MockMessageEditProviderValue = {
  editMessage: vi.fn(),
  clearSelectedMessageToEdit: vi.fn(),
  selectedMessageToEdit: {
    id: "1321",
    createdAt: serverTimestamp(),
    text: "Hi Jon!",
    type: "normal",
    user: "Jon Snow",
    userId: "1",
  },
};

export const mockUnselectedMessageValue: MockMessageEditProviderValue = {
  editMessage: vi.fn(),
  clearSelectedMessageToEdit: vi.fn(),
  selectedMessageToEdit: null,
};
