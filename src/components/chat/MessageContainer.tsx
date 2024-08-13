import React, { useEffect, useRef } from "react";
import NormalMessage from "./messages/NormalMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ConfigMessage from "./messages/ConfigMessage";
import { messageApi } from "../../features/api/messageApi";
import NormalMessageData from "../../types/message/NormalMessageData";
import ConfigMessageData from "../../types/message/ConfigMesageData";
import Loading from "../Loading";

const MessageContainer: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  const selectedChat = useSelector(
    (state: RootState) => state.selectedChat.value
  );
  const chatId = selectedChat?.id || "";

  const { data, isLoading, isFetching, isError } =
    messageApi.endpoints.getChatMessages.useQuery(chatId);

  useEffect(() => {
    scrollDown();
  }, [data]);

  function scrollDown(): void {
    const current = containerRef.current;
    if (current) current.scrollTop = current.scrollHeight;
  }

  if (isLoading || isFetching) return <Loading />;
  if (isError) return <div>Error!</div>;

  return (
    <section
      ref={containerRef}
      className="h-full overflow-y-scroll flex flex-col gap-2 p-2"
    >
      {data?.map((message, index) =>
        message.type === "normal" ? (
          <NormalMessage key={index} message={message as NormalMessageData} />
        ) : (
          <ConfigMessage key={index} message={message as ConfigMessageData} />
        )
      )}
    </section>
  );
};

export default MessageContainer;
