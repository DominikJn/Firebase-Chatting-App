import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("should render passed error message", () => {
    const error = "Error occurred";
    render(<ErrorMessage error={error} />);

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toHaveClass(
      "text-red-700 text-center text-lg h-8"
    );
  });
});
