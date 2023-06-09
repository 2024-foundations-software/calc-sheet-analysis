import React , {useState} from "react";
import Formula from "./Formula";
import KeyPad from "./KeyPad";
import Machine from "../Engine/Machine";
import SheetHolder from "./SheetHolder";


interface CalculatorInputProcessorProps {
  machine: Machine;
}

function CalculatorInputProcessor(props: CalculatorInputProcessorProps) {

  const { machine } = props;
  const [formulaString, setFormulaString]  = useState(machine.getFormulaString())
  const [resultString, setResultString]  = useState(machine.getResultString())
  const [cells, setCells] = useState(machine.getSheetDisplayStrings());

  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const text = event.currentTarget.textContent;
   
    if (text) {
      let trueText = text ? text : "";
      machine.addToken(trueText);
      setFormulaString(machine.getFormulaString());
      setResultString(machine.getResultString());
    }
  }

  /**
   * 
   * @param event 
   * 
   * This function is called when a cell is clicked
   * It will get the value of 
   */
  function onCellClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const text = event.currentTarget.textContent;
    // calculate the current row and column of the clicked on cell
    
    if (text) {
      let trueText = text ? text : "";
      console.log("onCellClick: " + trueText);
    }
  }


     
  return (
    <div>
      <Formula formulaString = {formulaString} resultString={resultString} ></Formula>
      { <SheetHolder  cellsValues = {cells} onClick={onCellClick}></SheetHolder> }
      <KeyPad onButtonClick={onButtonClick}></KeyPad>    
    </div>
  )
};

export default CalculatorInputProcessor;