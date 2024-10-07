import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../../components/Loading";

describe("Loading", () => {
  it("should render spinning loading icon", () => {
    render(<Loading />);

    expect(screen.getByTestId("loading")).toHaveClass("animate-spin-fast");
    //default color
    expect(screen.getByTestId("loading")).toHaveAttribute("color", "white");
  });

  it("should render in dark mode", () => {
    render(<Loading dark />);

    expect(screen.getByTestId("loading")).toHaveAttribute("color", "#0F172A");
  });
});
