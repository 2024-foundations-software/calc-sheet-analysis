import React , {useState} from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import Machine from "../Engine/Machine";
import SheetHolder from "./SheetHolder";
import { assert } from "console";


interface CalculatorInputProcessorProps {
  machine: Machine;
}

function CalculatorInputProcessor(props: CalculatorInputProcessorProps) {

  const { machine } = props;
  const [formulaString, setFormulaString]  = useState(machine.getFormulaString())
  const [resultString, setResultString]  = useState(machine.getResultString())
  const [cells, setCells] = useState(machine.getSheetDisplayStrings());
  const [statusString, setStatusString] = useState(machine.getEditStatusString());


  function updateDisplayValues(): void {
    setFormulaString(machine.getFormulaString());
    setResultString(machine.getResultString());
    setStatusString(machine.getEditStatusString());
    setCells(machine.getSheetDisplayStrings());
  }


  function onCommandButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const text = event.currentTarget.textContent;
    if (text) {
      let trueText = text ? text : "";
      machine.processCommandButton(trueText);
      if (trueText === "edit") {
        machine.setEditStatus(true);
        setStatusString(machine.getEditStatusString());
        console.log("Editing turned on");
      }
      if (trueText === "=") {
        machine.setEditStatus(false);
        setStatusString(machine.getEditStatusString());

        console.log("Editing turned off");
      }

      updateDisplayValues();
    }
  }

  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const text = event.currentTarget.textContent;
   
    if (text) {
      let trueText = text ? text : "";
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
    console.log("onCellClick: [" + cellLabel + "]");
    const editStatus = machine.getEditStatus();
    const cellLabelString = cellLabel ? cellLabel : "";
    if (editStatus) {
      console.log("onCellClick: editStatus is true, so we are adding a token ["+cellLabelString+"] to the forumula");
      machine.addToken(cellLabel ? cellLabel : "");
      updateDisplayValues();
    }
    else {
      console.log("onCellClick: editStatus is false, so we are updating the current formula to ["+cellLabelString+"]");
      machine.setCurrentCellByLabel(cellLabel ? cellLabel : "");
      let currentLabel:string = machine.getCurrentCellLabel();
      console.log("onCellClick: currentLabel is ["+currentLabel+"]");
      updateDisplayValues();
    }
    
  }


     
  return (
    <div>
      <Formula formulaString = {formulaString} resultString={resultString} ></Formula>
      <Status statusString = {statusString}></Status>
      { <SheetHolder  cellsValues = {cells} onClick={onCellClick}></SheetHolder> }
      <KeyPad onButtonClick={onButtonClick} onCommandButtonClick={onCommandButtonClick}></KeyPad>    
    </div>
  )
};

export default CalculatorInputProcessor;