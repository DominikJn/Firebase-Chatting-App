import React, { useEffect, useRef, useState } from "react";
import NormalMessage from "./messages/NormalMessage";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ConfigMessage from "./messages/ConfigMessage";
import { useGetChatMessagesQuery } from "../../features/api/messageApi";
import NormalMessageData from "../../types/message/NormalMessageData";
import ConfigMessageData from "../../types/message/ConfigMesageData";
import Loading from "../Loading";
import ScrollDownButton from "./ScrollDownButton";

const MessageContainer: React.FC = () => {
  //automatically scroll down based on position of scrollTop of message container
  const [isInScrollDownMode, setScrollDownMode] = useState<boolean>(true);
  const containerRef = useRef<HTMLElement>(null);

  const selectedChat = useSelector(
    (state: RootState) => state.selectedChat.value
  );
  const chatId = selectedChat?.id || "";

  const { data, isLoading, isFetching, isError } =
    useGetChatMessagesQuery(chatId);

  useEffect(() => {
    if (isInScrollDownMode) scrollDown();
  }, [data]);

  function checkIfIsInScrollingDownMode(): void {
    const scrollTop = containerRef.current?.scrollTop as number;
    const scrollHeight = containerRef.current?.scrollHeight as number;
    const clientHeight = containerRef.current?.clientHeight as number;
    const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    //if scrollTop position is under 80% of scrollHeight then disable automatic scroll down
    const isInScrollDownMode = percentage > 80 ? true : false;

    setScrollDownMode(isInScrollDownMode);
  }

  function scrollDown(): void {
    const current = containerRef.current;
    if (current) current.scrollTop = current.scrollHeight;
  }

  if (isLoading || isFetching) return <Loading />;
  if (isError) return <div>Error!</div>;

  return (
    <section
      ref={containerRef}
      className="h-full overflow-y-scroll flex flex-col gap-2 p-2 relative"
      onScroll={checkIfIsInScrollingDownMode}
    >
      {!isInScrollDownMode && <ScrollDownButton scrollDown={scrollDown} />}
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
