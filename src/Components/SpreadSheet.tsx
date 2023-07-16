import React, { useState } from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import SpreadSheetController from "../Engine/SpreadSheetController";
import SheetHolder from "./SheetHolder";

import { ButtonNames } from "../Engine/GlobalDefinitions";




/**
 * the main component for the Spreadsheet.  It is the parent of all the other components
 * 
 *
 * */



// make this a variable so we can resize it later (this would necessitate a new machine)
let spreadSheetController: SpreadSheetController = new SpreadSheetController(5, 8);

function SpreadSheet() {
  const [formulaString, setFormulaString] = useState(spreadSheetController.getFormulaString())
  const [resultString, setResultString] = useState(spreadSheetController.getResultString())
  const [cells, setCells] = useState(spreadSheetController.getSheetDisplayStringsForGUI());
  const [statusString, setStatusString] = useState(spreadSheetController.getEditStatusString());
  const [currentCell, setCurrentCell] = useState(spreadSheetController.getCurrentCellLabel());
  const [currentlyEditing, setCurrentlyEditing] = useState(spreadSheetController.getEditStatus());


  function updateDisplayValues(): void {

    setFormulaString(spreadSheetController.getFormulaString());
    setResultString(spreadSheetController.getResultString());
    setStatusString(spreadSheetController.getEditStatusString());
    setCells(spreadSheetController.getSheetDisplayStringsForGUI());

    setCurrentCell(spreadSheetController.getCurrentCellLabel());
    setCurrentlyEditing(spreadSheetController.getEditStatus());
  }

  /**
   * 
   * @param event 
   * 
   * This function is the call back for the command buttons
   * 
   * It will call the machine to process the command button
   * 
   * the buttons done, edit, clear, all clear, and restart do not require asynchronous processing
   * 
   * the other buttons do require asynchronous processing and so the function is marked async
   */
  async function onCommandButtonClick(text: string): Promise<void> {


    switch (text) {
      case ButtonNames.edit_toggle:
        if (currentlyEditing) {
          spreadSheetController.setEditStatus(false);
        } else {
          spreadSheetController.setEditStatus(true);
        }
        setStatusString(spreadSheetController.getEditStatusString());
        break;

      case ButtonNames.clear:
        spreadSheetController.removeToken();
        break;

      case ButtonNames.allClear:
        spreadSheetController.clearFormula();
        break;

    }
    // update the display values
    updateDisplayValues();
  }

  /**
   *  This function is the call back for the number buttons and the Parenthesis buttons
   * 
   * They all automatically start the editing of the current formula.
   * 
   * @param event
   * 
   * */
  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {

    const text = event.currentTarget.textContent;
    let trueText = text ? text : "";
    spreadSheetController.setEditStatus(true);
    spreadSheetController.addToken(trueText);

    updateDisplayValues();

  }



  /**
   * 
   * @param event 
   * 
   * This function is called when a cell is clicked
   * If the edit status is true then it will send the token to the machine.
   * If the edit status is false then it will ask the machine to update the current formula.
   */
  function onCellClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const cellLabel = event.currentTarget.getAttribute("cell-label");
    // calculate the current row and column of the clicked on cell

    const editStatus = spreadSheetController.getEditStatus();
    let realCellLabel = cellLabel ? cellLabel : "";


    // if the edit status is true then add the token to the machine
    if (editStatus) {
      spreadSheetController.addCell(realCellLabel);  // this will never be ""
      updateDisplayValues();
    }
    // if the edit status is false then set the current cell to the clicked on cell
    else {
      spreadSheetController.setCurrentCellByLabel(realCellLabel);
      updateDisplayValues();
    }

  }

  return (
    <div>
      <Formula formulaString={formulaString} resultString={resultString}  ></Formula>
      <Status statusString={statusString}></Status>
      {<SheetHolder cellsValues={cells}
        onClick={onCellClick}
        currentCell={currentCell}
        currentlyEditing={currentlyEditing} ></SheetHolder>}
      <KeyPad onButtonClick={onButtonClick}
        onCommandButtonClick={onCommandButtonClick}
        currentlyEditing={currentlyEditing}></KeyPad>
    </div>
  )
};

export default SpreadSheet;