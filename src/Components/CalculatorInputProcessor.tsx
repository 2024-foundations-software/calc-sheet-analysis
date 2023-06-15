import React, { useState } from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import Machine from "../Engine/Machine";
import SheetHolder from "./SheetHolder";

import { ButtonNames } from "../Engine/GlobalDefinitions";


interface CalculatorInputProcessorProps {
  machine: Machine;
}






// This component is the main component for the calculator



function CalculatorInputProcessor(props: CalculatorInputProcessorProps) {

  const { machine } = props;
  const [formulaString, setFormulaString] = useState(machine.getFormulaString())
  const [resultString, setResultString] = useState(machine.getResultString())
  const [cells, setCells] = useState(machine.getSheetDisplayStringsForGUI());
  const [statusString, setStatusString] = useState(machine.getEditStatusString());
  const [currentCell, setCurrentCell] = useState(machine.getCurrentCellLabel());
  const [currentlyEditing, setCurrentlyEditing] = useState(machine.getEditStatus());


  function updateDisplayValues(): void {
    setFormulaString(machine.getFormulaString());
    setResultString(machine.getResultString());
    setStatusString(machine.getEditStatusString());
    setCells(machine.getSheetDisplayStringsForGUI());
    setCurrentCell(machine.getCurrentCellLabel());
    setCurrentlyEditing(machine.getEditStatus());
  }


  function onCommandButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const text = event.currentTarget.textContent;
    if (text) {
      let trueText = text ? text : "";
      machine.processCommandButton(trueText);
      if (trueText === ButtonNames.edit) {
        machine.setEditStatus(true);
        setStatusString(machine.getEditStatusString());
      }

      if (trueText === ButtonNames.done) {
        machine.setEditStatus(false);
        setStatusString(machine.getEditStatusString());
      }

      if (trueText === ButtonNames.clear) {
        machine.removeToken();
      }

      if (trueText === ButtonNames.allClear) {
        machine.clearFormula();
      }

      if (trueText === ButtonNames.restart) {
        machine.restart();
      }


      updateDisplayValues();
    }
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

    if (text) {
      let trueText = text ? text : "";
      machine.setEditStatus(true);
      machine.addToken(trueText);

      updateDisplayValues();
    }
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

    const editStatus = machine.getEditStatus();

    // if the edit status is true then add the token to the machine
    if (editStatus) {
      machine.addToken(cellLabel ? cellLabel : "");
      updateDisplayValues();
    }
    // if the edit status is false then set the current cell to the clicked on cell
    else {
      machine.setCurrentCellByLabel(cellLabel ? cellLabel : "");
      updateDisplayValues();
    }

  }



  return (
    <div>
      <Formula formulaString={formulaString} resultString={resultString}  ></Formula>
      <Status statusString={statusString}></Status>
      {<SheetHolder cellsValues={cells} onClick={onCellClick} currentCell={currentCell} currentlyEditing={currentlyEditing} ></SheetHolder>}
      <KeyPad onButtonClick={onButtonClick} onCommandButtonClick={onCommandButtonClick}></KeyPad>
    </div>
  )
};

export default CalculatorInputProcessor;