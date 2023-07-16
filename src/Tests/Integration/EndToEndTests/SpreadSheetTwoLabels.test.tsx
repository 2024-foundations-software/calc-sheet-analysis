/**
 * @jest-environment jsdom
 */

import React from "react";

import { render, fireEvent, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SpreadSheet from "../../../Components/SpreadSheet";

import KeyPad from "../../../Components/KeyPad";

import SpreadSheetEngine from "../../../Engine/SpreadSheetEngine";

import { ErrorMessages } from "../../../Engine/GlobalDefinitions";
import { after } from "node:test";
import { act } from "react-dom/test-utils";





describe("SpreadSheet A2 + A2", () => {

    it("Can add up two identical cells A2 + A2, A2 is 2, result should be A1 has the formula and the value 4", async () => {
        render(
            <SpreadSheet />
        );

        const A1cell = screen.getByTestId("A1");
        const A2cell = screen.getByTestId("A2");
        const add_button = screen.getByTestId("add-button");
        const edit_toggle = screen.getByTestId("edit-toggle-button");

        // set A2 to 1
        act(() => {
            fireEvent.click(A2cell);
            fireEvent.click(screen.getByTestId("two-button"));
        });

        expect(screen.getByTestId("FormulaValue")).toHaveTextContent("2");

        act(() => {
            edit_toggle.click();
        });
        await waitFor(() => {
            expect(screen.getByTestId("StatusComponent")).toHaveTextContent("current cell: A2");
        });

        act(() => {
            fireEvent.click(A1cell);
            fireEvent.click(edit_toggle);
        });


        await waitFor(() => {
            expect(screen.getByTestId("StatusComponent")).toHaveTextContent("editing: A1");
        });

        act(() => {
            fireEvent.click(A2cell);
            fireEvent.click(add_button);
            fireEvent.click(A2cell);
        });
        await waitFor(() => {
            expect(screen.getByTestId("FormulaValue")).toHaveTextContent("A2 + A2");
        });

        await waitFor(() => {
            fireEvent.click(edit_toggle);
        });

        await waitFor(() => {
            expect(screen.getByTestId("StatusComponent")).toHaveTextContent("current cell: A1");
        });

        // now select A1 and see that the formula is A2 + A2 and the result is 2
        await waitFor(() => {
            expect(screen.getByTestId("FormulaValue")).toHaveTextContent("A2 + A2");
        });

        // get the text content of the formula result
        await waitFor(() => {
            expect(screen.getByTestId("FormulaResult")).toHaveTextContent("4");
        });
    });
});

