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


describe("SpreadSheet 1 + 2 ", () => {
    afterEach(() => {
        cleanup();
    });
    it("updates the formula and result strings when a number button is clicked", async () => {
        render(
            <SpreadSheet />
        );


        const oneButton = screen.getByTestId("one-button");
        const formulaValue = screen.getByTestId("FormulaValue");

        act(() => {
            fireEvent.click(oneButton);
        });

        await waitFor(() => {
            expect(formulaValue).toHaveTextContent("1");
        });
        await waitFor(() => {
            expect(screen.getByTestId("FormulaValue")).toHaveTextContent("1");
        });
        await waitFor(() => {
            expect(screen.getByTestId("FormulaResult")).toHaveTextContent("1");
        });

        act(() => {
            fireEvent.click(screen.getByTestId("add-button"));
        });

        await waitFor(() => {
            expect(screen.getByTestId("FormulaValue")).toHaveTextContent("1 +");
        });
        await waitFor(() => {
            expect(screen.getByTestId("FormulaResult")).toHaveTextContent(ErrorMessages.invalidFormula);
        });

        act(() => {
            fireEvent.click(screen.getByTestId("two-button"));
        });

        await waitFor(() => {
            expect(screen.getByTestId("FormulaValue")).toHaveTextContent("1 + 2");
        });
        await waitFor(() => {
            expect(screen.getByTestId("FormulaResult")).toHaveTextContent("3");
        });
    });


});
