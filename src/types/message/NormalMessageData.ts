import type MessageData from "./MessageData";

interface NormalMessageData extends MessageData {
  id: string;
  user: string;
  userId: string;
  file?: {
    url: string;
    type: string;
  };
  isEdited?: boolean;
}

export default NormalMessageData;
