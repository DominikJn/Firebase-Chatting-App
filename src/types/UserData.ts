import { FieldValue, Timestamp } from "firebase/firestore";

type UserData = {
  name: string;
  id: string;
  status?: {
    isActive: boolean;
    lastOnline: Timestamp | FieldValue | null;
  };
};

export default UserData;
