import type MessageData from "./MessageData";

interface NormalMessageData extends MessageData {
  user: string;
  userId: string;
  file?: {
    url: string;
    type: string;
  };
}

export default NormalMessageData;
