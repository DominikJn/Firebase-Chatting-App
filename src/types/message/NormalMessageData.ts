import type MessageData from "./MessageData";

interface NormalMessageData extends MessageData {
  user: string;
  userId: string;
}

export default NormalMessageData;
