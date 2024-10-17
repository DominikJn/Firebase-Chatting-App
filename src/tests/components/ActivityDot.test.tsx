import React from "react";
import { render, screen } from "@testing-library/react";
import ActivityDot from "../../components/ActivityDot";

describe("ActivityDot", () => {
  it("renders activity dot correctly", () => {
    render(<ActivityDot />);

    //check if has p-2 by default
    expect(screen.getByTestId("active-dot")).toHaveClass(/p-2/i);
  });

  it("renders adjusted activity dot with different padding and testid", () => {
    render(<ActivityDot size={8} testidAdditional="-random" />);

    expect(screen.getByTestId("active-dot-random")).toHaveClass(/p-8/i);
  });
});
