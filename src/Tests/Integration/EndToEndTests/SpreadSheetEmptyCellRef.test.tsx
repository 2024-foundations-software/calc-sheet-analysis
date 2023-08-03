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






it("the formula result is #REF! when cell reference points to an empty cell", () => {
    const { getByText, getByTestId } = render(
        <SpreadSheet documentName={'test'} />
    );

    const formulaValue = getByTestId("FormulaValue");
    const formulaResult = getByTestId("FormulaResult");
    const A1cell = getByTestId("A1");
    const A2cell = getByTestId("A2");
    const done_button = getByTestId("edit-toggle-button");


    fireEvent.click(A1cell);
    fireEvent.click(done_button);
    fireEvent.click(A2cell);
    fireEvent.click(done_button);

    expect(formulaValue).toHaveTextContent("A2");
    expect(formulaResult).toHaveTextContent(ErrorMessages.invalidCell);
    expect(A1cell).toHaveTextContent(ErrorMessages.invalidCell);
});

