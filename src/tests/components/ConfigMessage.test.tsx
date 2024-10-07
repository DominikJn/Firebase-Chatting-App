import React from "react";
import { render, screen } from "@testing-library/react";
import ConfigMessage from "../../components/chat/messages/ConfigMessage";
import { serverTimestamp } from "firebase/firestore";
import ConfigMessageData from "../../types/message/ConfigMesageData";

describe("ConfigMessage", () => {
  const message: ConfigMessageData = {
    createdAt: serverTimestamp(),
    type: "config",
    text: "Chatname has been updated",
  };

  it("should render message text with date and time", () => {
    render(<ConfigMessage message={message} />);

    expect(screen.getByText(/chatname has been updated/i)).toBeInTheDocument();
    expect(screen.getByTestId("datetime")).toBeInTheDocument();
  });
});
