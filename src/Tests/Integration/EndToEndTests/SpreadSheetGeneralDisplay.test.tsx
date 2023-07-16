/**
 * @jest-environment jsdom
 */

import React from "react";

import { render, fireEvent, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SpreadSheet from "../../../Components/SpreadSheet";

import KeyPad from "../../../Components/KeyPad";

import SpreadSheetController from "../../../Engine/SpreadSheetController";

import { ErrorMessages } from "../../../Engine/GlobalDefinitions";
import { after } from "node:test";
import { act } from "react-dom/test-utils";

it("updates the current cell when a cell is clicked on", () => {
    const { getByText, getByTestId } = render(
        <SpreadSheet />
    );
    const statusComponent = getByTestId("StatusComponent");

    const A1cell = getByTestId("A1");
    const A2cell = getByTestId("A2");

    expect(statusComponent).toHaveTextContent("current cell: A1");

    fireEvent.click(A2cell);
    expect(statusComponent).toHaveTextContent("current cell: A2");

});

describe("CalculatorInputProcessor", () => {



    it("renders the formula, status, sheet holder, and keypad", () => {

        const { getByTestId } = render(
            <SpreadSheet />
        );
        const formula = getByTestId("FormulaTitle");

        expect(getByTestId("FormulaTitle")).toBeInTheDocument();
        expect(getByTestId("FormulaResult")).toBeInTheDocument();

    });
});

describe("test2", () => {
    it("calls the onButtonClick callback when a button is clicked", () => {
        const onButtonClick = jest.fn();
        const onCommandButtonClick = jest.fn();
        const { getByTestId } = render(<KeyPad onButtonClick={onButtonClick}
            onCommandButtonClick={onCommandButtonClick} currentlyEditing={true} />);

        const oneButton = screen.getByTestId("one-button");

        fireEvent.click(oneButton);

        expect(onButtonClick).toHaveBeenCalled();
    });
});


