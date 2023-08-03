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










it("when editing a cell a circular reference is ignored", () => {
    const { getByText, getByTestId } = render(
        <SpreadSheet documentName={'test'} />
    );

    const formulaValue = getByTestId("FormulaValue");
    const formulaResult = getByTestId("FormulaResult");
    const A1cell = getByTestId("A1");
    const A2cell = getByTestId("A2");
    const A3cell = getByTestId("A3");

    const done_button = getByTestId("edit-toggle-button");

    // set A1 to point to A1
    fireEvent.click(A1cell);
    fireEvent.click(done_button); // turns on editing
    fireEvent.click(A2cell);      // sets the formula to A2
    fireEvent.click(done_button); // turns off editing

    expect(formulaValue).toHaveTextContent("A2");
    expect(formulaResult).toHaveTextContent("#REF!");
    expect(A1cell).toHaveTextContent("#REF!");

    fireEvent.click(A2cell);
    fireEvent.click(done_button);
    fireEvent.click(A3cell);
    fireEvent.click(done_button);

    expect(formulaValue).toHaveTextContent("A3");
    expect(formulaResult).toHaveTextContent("#REF!");
    expect(A2cell).toHaveTextContent("#REF!");

    fireEvent.click(A3cell);
    fireEvent.click(done_button);
    fireEvent.click(A1cell);
    fireEvent.click(done_button);

    expect(formulaValue).toHaveTextContent("");


});

