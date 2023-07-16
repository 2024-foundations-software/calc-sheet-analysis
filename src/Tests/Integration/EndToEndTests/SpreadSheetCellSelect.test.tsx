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





describe("SpreadSheet ", () => {

    it("selects A3 enters 88 then presses done then selects A1 clicks on edit then clicks on A3 and sees 88", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet />
        );
        const statusComponent = getByTestId("StatusComponent");
        const formulaValue = getByTestId("FormulaValue");
        const formulaResult = getByTestId("FormulaResult");
        const A1cell = getByTestId("A1");
        const A3cell = getByTestId("A3");
        const eight_button = getByTestId("eight-button");
        const done_button = getByTestId("edit-toggle-button");


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

        fireEvent.click(done_button);
        expect(statusComponent).toHaveTextContent("editing: A1");

        fireEvent.click(A3cell);
        expect(statusComponent).toHaveTextContent("editing: A1");
        expect(formulaValue).toHaveTextContent("A3");
        expect(formulaResult).toHaveTextContent("88");




    });
});

