import SheetMemory from "./SheetMemory"
import Recalc from "./Recalc"
import RecalcDependency from "./RecalcDependency"
import TokenProcessor from "./TokenProcessor";
import Cell from "./Cell";


/**
 *  The main object of the SpreadSheet
 * 
 *  The exported methods are
 * 
 * addToken(token:string):  void
 * 
 * getFormulaString(void): string
 * 
 * getFormulaValue(void): string
 * 
 * setCurrentCell( column:number, row_number)): void
 * 
 * getSheetValues(void): string[][]
 * 
 * 
 * 
 */
export class Machine{ 
  
  /** all the private members
   * 
   */

  /** The memory for the sheet */
  private memory: SheetMemory;
  private recalc: Recalc = new Recalc();
  private currentRow = 0;
  private currentColumn = 0;

  private tokenProcessor: TokenProcessor = new TokenProcessor();
  private recalcDependency: RecalcDependency = new RecalcDependency();



  constructor(columns: number, rows: number){
    this.memory = new SheetMemory(columns,rows);
  }

  /**
   * processCommandButton
   */
  public processCommandButton(command: string): void{
    console.log("processCommandButton: " + command);
  }
 /**  
  *  add token to current formula
  * 
  * @param token:string
  * Inform the memory that the current cell formula has changed
  * 
  */
  addToken(token: string): void{

    this.tokenProcessor.addToken(token);
    this.memory.setCurrentCellFormula(this.tokenProcessor.getFormula());

    this.recalcDependency.evaluateSheet(this.memory);

    this.memory.setCurrentCellFormula(this.tokenProcessor.getFormula()); 
  }

  /**
   *  Get the formula as a string
   *  
   * @returns the formula as a string
   * 
   * */
  getFormulaString(): string{
    return this.tokenProcessor.getFormulaString();
  }

  /** 
   * Get the formula as a value (formatted to a string)
   *  
   * @returns the formula as a value:string 
   * 
   * */
  getResultString(): string{
    let currentFormula = this.tokenProcessor.getFormula();
    const [, displayString] = this.recalc.evaluate(currentFormula, this.memory);
    return displayString;
  }


  /** 
   * set the working cell by label
   * 
   * @param label:string
   * 
   * 
   */
  setCurrentCellByLabel(label: string): void{
    const [column, row] = Cell.cellToColumnRow(label);
    this.setCurrentCellByCoordinates(column, row);
  }

  /**
   * Set the working cell
   * 
   * @param row:number ß
   * @param column:number
   * 
   * save the formula that is in the tokenProcessor to the current cell
   * 
   * copy the formula from the new cell into the tokenProcessor
   * 
   * */
  setCurrentCellByCoordinates(column: number, row: number ): void{
    if (column === this.currentColumn && row === this.currentRow) return;

    let currentFormula = this.tokenProcessor.getFormula();
    this.memory.setCurrentCellFormula(currentFormula);

    this.memory.setCurrentCellCoordinates(column, row);
    currentFormula = this.memory.getCurrentCellFormula();
    this.tokenProcessor.setFormula(currentFormula);

    this.currentColumn = column;
    this.currentRow = row;

    this.memory.setCurrentCellCoordinates(column, row);

  }

  /**
   * Get the Sheet Display Values
   * 
   * @returns string[][]
   */
  public getSheetDisplayStrings(): string[][]{
    return this.memory.getSheetDisplayStrings();
  }




 
 

}

export default Machine;