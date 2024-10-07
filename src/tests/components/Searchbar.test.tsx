import React from "react";
import { render, screen } from "@testing-library/react";
import Searchbar from "../../components/Searchbar";

describe("Searchbar", () => {
  it("renders input and search icon", () => {
    const { container } = render(<Searchbar />);

    const input = screen.getByRole("textbox");
    const searchIcon = container.querySelector("svg");

    expect(input).toBeInTheDocument();
    expect(searchIcon).toBeInTheDocument();
  });
});
