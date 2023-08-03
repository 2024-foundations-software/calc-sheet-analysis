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






describe("SpreadSheet clear and all clear", () => {
    it("clear and all clear work as expected.", () => {
        const { getByText, getByTestId } = render(
            <SpreadSheet documentName={'test'} />
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
        expect(formulaResult).toHaveTextContent(ErrorMessages.invalidFormula);

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
});

