/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SpreadSheet from "../../Components/SpreadSheet";

import KeyPad from "../../Components/KeyPad";

import SpreadSheetEngine from "../../Engine/SpreadSheetEngine";

describe("CalculatorInputProcessor", () => {
    let machine: SpreadSheetEngine;

    beforeEach(() => {
        machine = new SpreadSheetEngine(5, 8);
    });

    it("renders the formula, status, sheet holder, and keypad", () => {
        const { getByTestId } = render(
            <SpreadSheet machine={machine} />
        );
        const formula = getByTestId("FormulaTitle");

        expect(getByTestId("FormulaTitle")).toBeInTheDocument();
        expect(getByTestId("FormulaResult")).toBeInTheDocument();

    });

    it("calls the onButtonClick callback when a button is clicked", () => {
        const onButtonClick = jest.fn();
        const onCommandButtonClick = jest.fn();
        const { getByTestId } = render(<KeyPad onButtonClick={onButtonClick} onCommandButtonClick={onCommandButtonClick} />);

        const oneButton = screen.getByTestId("one-button");

        fireEvent.click(oneButton);

        expect(onButtonClick).toHaveBeenCalled();
    });


    it("updates the formula and result strings when a number button is clicked", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );


        const oneButton = getByTestId("one-button");
        const formulaValue = getByTestId("FormulaValue");

        expect(formulaValue).toHaveTextContent("");

        fireEvent.click(oneButton);

        expect(formulaValue).toHaveTextContent("1");
        expect(getByTestId("FormulaValue")).toHaveTextContent("1");

        expect(getByTestId("FormulaResult")).toHaveTextContent("1");

        fireEvent.click(getByTestId("add-button"));
        expect(getByTestId("FormulaValue")).toHaveTextContent("1 +");
        expect(getByTestId("FormulaResult")).toHaveTextContent("1");

        fireEvent.click(getByTestId("two-button"));
        expect(getByTestId("FormulaValue")).toHaveTextContent("1 + 2");
        expect(getByTestId("FormulaResult")).toHaveTextContent("3");
    });

    it("Can add up two identical cells A2 + A2, A2 is 1, result should be A1 has the formula and the value 2", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const A1cell = getByTestId("A1");
        const A2cell = getByTestId("A2");

        // set A2 to 1
        fireEvent.click(A2cell);
        fireEvent.click(getByTestId("one-button"));
        fireEvent.click(getByTestId("done-button"));

        fireEvent.click(A1cell);
        fireEvent.click(getByTestId("edit-button"));
        fireEvent.click(A2cell);
        fireEvent.click(getByTestId("add-button"));
        fireEvent.click(A2cell);
        fireEvent.click(getByTestId("done-button"));

        expect(getByTestId("FormulaValue")).toHaveTextContent("A2 + A2");
        expect(getByTestId("FormulaResult")).toHaveTextContent("2");

    });
    it("can make a number with consecutive digits", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const formulaValue = getByTestId("FormulaValue");

        fireEvent.click(getByTestId("one-button"));
        expect(formulaValue).toHaveTextContent("1");

        fireEvent.click(getByTestId("two-button"));
        expect(formulaValue).toHaveTextContent("12");

        fireEvent.click(getByTestId("decimal-button"));
        expect(formulaValue).toHaveTextContent("12.");

        fireEvent.click(getByTestId("five-button"));
        expect(formulaValue).toHaveTextContent("12.5");


    });

    it("updates the current cell when a cell is clicked on", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );
        const statusComponent = getByTestId("StatusComponent");

        const A1cell = getByTestId("A1");
        const A2cell = getByTestId("A2");

        expect(statusComponent).toHaveTextContent("current cell: A1");

        fireEvent.click(A2cell);
        expect(statusComponent).toHaveTextContent("current cell: A2");

    });

    it("updates the status when a digit is pressed then goes back to current when done is pressed", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );
        const statusComponent = getByTestId("StatusComponent");

        const one_button = getByTestId("one-button");
        const done_button = getByTestId("done-button");


        expect(statusComponent).toHaveTextContent("current cell: A1");

        fireEvent.click(one_button);
        expect(statusComponent).toHaveTextContent("editing: A1");

        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("current cell: A1");

    });

    it("selects A3 enters 88 then presses done then selects A1 clicks on edit then clicks on A3 and sees 88", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );
        const statusComponent = getByTestId("StatusComponent");
        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");
        const A3cell = getByTestId("A3");
        const eight_button = getByTestId("eight-button");
        const done_button = getByTestId("done-button");
        const edit_button = getByTestId("edit-button");

        fireEvent.click(A3cell);
        expect(statusComponent).toHaveTextContent("current cell: A3");

        fireEvent.click(eight_button);
        expect(statusComponent).toHaveTextContent("editing: A3");
        expect(formulaValue).toHaveTextContent("8");

        fireEvent.click(eight_button);
        expect(statusComponent).toHaveTextContent("editing: A3");
        expect(formulaValue).toHaveTextContent("88");

        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("current cell: A3");

        fireEvent.click(A1cell);
        expect(statusComponent).toHaveTextContent("current cell: A1");

        fireEvent.click(edit_button);
        expect(statusComponent).toHaveTextContent("editing: A1");

        fireEvent.click(A3cell);
        expect(statusComponent).toHaveTextContent("editing: A1");
        expect(formulaValue).toHaveTextContent("A3");
        expect(formulaResult).toHaveTextContent("88");




    });


    it("clear and all clear work as expected.", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");

        const one_button = getByTestId("one-button");
        const clear_button = getByTestId("clear-button");
        const all_clear_button = getByTestId("all-clear-button");
        const add_button = getByTestId("add-button");

        fireEvent.click(one_button);
        fireEvent.click(one_button);
        fireEvent.click(one_button);

        fireEvent.click(add_button);
        fireEvent.click(one_button);
        fireEvent.click(one_button);

        expect(formulaValue).toHaveTextContent("111 + 11");
        expect(formulaResult).toHaveTextContent("122");

        fireEvent.click(clear_button);
        expect(formulaValue).toHaveTextContent("111 + 1");
        expect(formulaResult).toHaveTextContent("112");

        fireEvent.click(clear_button);
        expect(formulaValue).toHaveTextContent("111 +");
        expect(formulaResult).toHaveTextContent("111");

        fireEvent.click(clear_button);
        expect(formulaValue).toHaveTextContent("111");
        expect(formulaResult).toHaveTextContent("111");

        fireEvent.click(add_button);
        fireEvent.click(one_button);
        fireEvent.click(one_button);

        expect(formulaValue).toHaveTextContent("111 + 11");
        expect(formulaResult).toHaveTextContent("122");

        fireEvent.click(all_clear_button);

        expect(formulaValue).toHaveTextContent("");
        expect(formulaResult).toHaveTextContent("");

    });

    it("the formula result and the display value in the cell A1 are the same", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");

        const one_button = getByTestId("one-button");
        const add_button = getByTestId("add-button");
        const done_button = getByTestId("done-button");

        fireEvent.click(A1cell);
        fireEvent.click(one_button);

        expect(formulaValue).toHaveTextContent("1");
        expect(formulaResult).toHaveTextContent("1");
        expect(A1cell).toHaveTextContent("1");

        fireEvent.click(add_button);

        expect(formulaValue).toHaveTextContent("1 +");
        expect(formulaResult).toHaveTextContent("1");
        expect(A1cell).toHaveTextContent("1");

        fireEvent.click(one_button);
        fireEvent.click(done_button);

        expect(formulaValue).toHaveTextContent("1 + 1");
        expect(formulaResult).toHaveTextContent("2");
        expect(A1cell).toHaveTextContent("2");

    });

    it("the formula result is #REF! when cell reference points to an empty cell", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");
        const A2cell = getByTestId("A2");
        const edit_button = getByTestId("edit-button");

        fireEvent.click(A1cell);
        fireEvent.click(edit_button);
        fireEvent.click(A2cell);

        expect(formulaValue).toHaveTextContent("A2");
        expect(formulaResult).toHaveTextContent("#REF!");
        expect(A1cell).toHaveTextContent("#REF!");
    });

    it("when editing a cell a self reference is ignored", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");
        const one_button = getByTestId("one-button");
        const add_button = getByTestId("add-button");

        fireEvent.click(A1cell);
        fireEvent.click(one_button);
        fireEvent.click(add_button);
        fireEvent.click(A1cell);

        expect(formulaValue).toHaveTextContent("1 +");
        expect(formulaResult).toHaveTextContent("1");
        expect(A1cell).toHaveTextContent("1");

    });

    it("when editing a cell a circular reference is ignored", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );

        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");
        const A2cell = getByTestId("A2");
        const A3cell = getByTestId("A3");
        const edit_button = getByTestId("edit-button");
        const done_button = getByTestId("done-button");


        fireEvent.click(A1cell);
        fireEvent.click(edit_button);
        fireEvent.click(A2cell);
        fireEvent.click(done_button);

        expect(formulaValue).toHaveTextContent("A2");
        expect(formulaResult).toHaveTextContent("#REF!");
        expect(A1cell).toHaveTextContent("#REF!");

        fireEvent.click(A2cell);
        fireEvent.click(edit_button);
        fireEvent.click(A3cell);
        fireEvent.click(done_button);

        expect(formulaValue).toHaveTextContent("A3");
        expect(formulaResult).toHaveTextContent("#REF!");
        expect(A2cell).toHaveTextContent("#REF!");

        fireEvent.click(A3cell);
        fireEvent.click(edit_button);
        fireEvent.click(A1cell);
        fireEvent.click(done_button);

        expect(formulaValue).toHaveTextContent("");


    });

    it("clears the formula and edit status when the all clear button is clicked", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet machine={machine} />
        );
        const one_button = getByTestId("one-button");

        const all_clear_button = getByTestId("all-clear-button");
        fireEvent.click(getByTestId("one-button"));
        fireEvent.click(getByTestId("one-button"));
        fireEvent.click(getByTestId("one-button"));
        expect(getByTestId("FormulaValue")).toHaveTextContent("111");

        fireEvent.click(all_clear_button);
        expect(getByTestId("FormulaValue")).toHaveTextContent("");

    });



});