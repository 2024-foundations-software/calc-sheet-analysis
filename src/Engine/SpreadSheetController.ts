import SheetMemory from "./SheetMemory"
import FormulaEvaluator from "./FormulaEvaluator"
import CalculationManager from "./CalculationManager"
import FormulaBuilder from "./FormulaBuilder";
import Cell from "./Cell";

/**
 *  The main controller of the SpreadSheet
 * 
 * functions exported are
 * 
 * addToken(token:string):  void
 * addCell(cell:string): void
 * removeToken(): void
 * clearFormula(): void
 * getFormulaString(): string
 * getResultString(): string
 * setWorkingCellByLabel(label:string): void
 * getWorkingCellLabel(): string
 * setWorkingCellByCoordinates(column:number, row:number): void
 * getSheetDisplayStringsForGUI(): string[][]
 * getEditStatus(): boolean
 * setEditStatus(bool:boolean): void
 * getEditStatusString(): string
 * 
 * 
 *
 */
export class SpreadSheetController {
  /** The memory for the sheet */
  private _memory: SheetMemory;

  /** the local storage for the document */


  /** The current cell */
  private _currentWorkingRow = 0;
  private _currentWorkingColumn = 0;


  /**
   * The components that the SpreadSheetEngine uses to manage the sheet
   * 
   */

  // The formula evaluator, this is used to evaluate the formula for the current cell
  // it is only called for a cell when all cells it depends on have been evaluated
  private _formulaEvaluator: FormulaEvaluator;

  // The formula builder, this is used to build the formula for the current cell
  // it is used when the user is editing the formula for the current cell
  private _formulaBuilder: FormulaBuilder;

  // The current cell is being edited
  private _cellIsBeingEdited: boolean;;

  // The dependency manager, this is used to manage the dependencies between cells
  // The main job of this is to compute the order in which the cells should be evaluated
  private _calculationManager: CalculationManager;

  /**
   * constructor
   * */
  constructor(columns: number, rows: number) {
    this._memory = new SheetMemory(columns, rows);
    this._formulaEvaluator = new FormulaEvaluator(this._memory);
    this._calculationManager = new CalculationManager();
    this._formulaBuilder = new FormulaBuilder();
    this._cellIsBeingEdited = false;
  }


  /**  
   *  add token to current formula, this is not a cell and thus no dependency updating is needed
   * 
   * @param token:string
   * 
   * if the token is a valid cell label add it to the formula
   * 
   * 
   */
  addToken(token: string): void {


    // add the token to the formula
    this._formulaBuilder.addToken(token);
    // update the memory with the new formula
    let formula = this._formulaBuilder.getFormula();
    this._memory.setCurrentCellFormula(formula);
    // Do a recalc
    this._calculationManager.evaluateSheet(this._memory);
  }

  /**  
   *  add cell reference to current formula
   * 
   * @param cell:string
   * returns true if the token was added to the formula
   * returns false if a circular dependency is detected.
   * 
   * Assuming that the dependents have been updated
   * we will look at the dependsOn array for the cell being inserted
   * if the current cell is in the dependsOn array then we have a circular referenceoutloo
   */
  addCell(cellReference: string): void {

    // get the dependents for the cell being inserted

    if (cellReference === this.getWorkingCellLabel()) {
      // do nothing
      return;
    }

    let currentCell: Cell = this._memory.getCurrentCell();
    let currentLabel = currentCell.getLabel();

    // Check to see if we would be introducing a circular dependency
    // this function will update the dependency for the cell being inserted
    let okToAdd = this._calculationManager.okToAddNewDependency(currentLabel, cellReference, this._memory);

    // We have checked to see if this new token introduces a circular dependency
    // if it does not then we can add the token to the formula
    if (okToAdd) {
      this.addToken(cellReference);
    }
  }



  /**
   * 
   * remove the last token from the current formula
   * 
   */


  removeToken(): void {
    this._formulaBuilder.removeToken();
    this._memory.setCurrentCellFormula(this._formulaBuilder.getFormula());
    this._calculationManager.evaluateSheet(this._memory);
  }

  /**
   * 
   * clear the current formula
   * 
   */
  clearFormula(): void {
    this._formulaBuilder.setFormula([]);
    this._memory.setCurrentCellFormula(this._formulaBuilder.getFormula());
    this._calculationManager.evaluateSheet(this._memory);
  }

  /**
   *  Get the formula as a string
   *  
   * @returns the formula as a string
   * 
   * */
  getFormulaString(): string {
    return this._formulaBuilder.getFormulaString();
  }

  /** 
   * Get the formula as a value (formatted to a string)
   *  
   * @returns the formula as a value:string 
   * 
   * */
  getResultString(): string {
    let currentWorkingCell = this._memory.getCurrentCell();
    let displayString = currentWorkingCell.getDisplayString();

    return displayString;
  }


  /** 
   * set the working cell by label
   * 
   * @param label:string
   * 
   * 
   */
  setWorkingCellByLabel(label: string): void {
    const [column, row] = Cell.cellToColumnRow(label);
    this.setWorkingCellByCoordinates(column, row);
  }


  /**
   * get the current cell label
   * 
   * @returns the current cell label
   * 
   */
  getWorkingCellLabel(): string {
    return Cell.columnRowToCell(this._currentWorkingColumn, this._currentWorkingRow);
  }

  /**
   * Set the working cell
   * 
   * @param row:number ß
   * @param column:number
   * 
   * save the formula that is in the formulaBuilder to the current cell
   * 
   * copy the formula from the new cell into the formulaBuilder
   * 
   * */
  setWorkingCellByCoordinates(column: number, row: number): void {
    // if the cell is the same as the current cell do nothing
    if (column === this._currentWorkingColumn && row === this._currentWorkingRow) return;

    // get the current formula from the formula builder
    let currentFormula = this._formulaBuilder.getFormula();
    this._memory.setCurrentCellFormula(currentFormula);

    // get the formula from the new cell
    this._memory.setWorkingCellByCoordinates(column, row);
    currentFormula = this._memory.getCurrentCellFormula();
    this._formulaBuilder.setFormula(currentFormula);

    this._currentWorkingColumn = column;
    this._currentWorkingRow = row;

    this._memory.setWorkingCellByCoordinates(column, row);

  }

  /**
    * Get the Sheet Display Values
    * the GUI needs the data to be in row major order
    * 
    * @returns string[][]
    */
  public getSheetDisplayStringsForGUI(): string[][] {
    this._calculationManager.updateComputationOrder(this._memory);
    this._calculationManager.evaluateSheet(this._memory);

    let memoryDisplayValues = this._memory.getSheetDisplayStrings();
    let guiDisplayValues: string[][] = [];
    let inputRows = memoryDisplayValues.length;
    let inputColumns = memoryDisplayValues[0].length;

    for (let outputRow = 0; outputRow < inputColumns; outputRow++) {
      guiDisplayValues[outputRow] = [];
      for (let outputColumn = 0; outputColumn < inputRows; outputColumn++) {
        guiDisplayValues[outputRow][outputColumn] = memoryDisplayValues[outputColumn][outputRow];
      }
    }


    return guiDisplayValues;

  }




  /**
   * The edit status of the machine specifies what happens when a cell is clicked
   * 
   * @returns boolean
   * 
   * */
  public getEditStatus(): boolean {
    return this._cellIsBeingEdited;
  }

  /**
   * Set the edit status of the machine
   * 
   * @param bool:boolean
   * 
   * */
  public setEditStatus(bool: boolean): void {
    this._cellIsBeingEdited = bool;
  }

  /**
   * Get the edit status string
   *  
   * @returns string
   * 
   * */
  public getEditStatusString(): string {
    if (this._cellIsBeingEdited) {
      return "editing: " + this.getWorkingCellLabel();
    }
    return "current cell: " + this.getWorkingCellLabel();
  }

  public sheetToJSON(): string {
    return this._memory.sheetToJSON();
  }

  public updateSheetFromJSON(json: string): void {
    this._memory.updateSheetFromJSON(json);
  }

  static spreadsheetFromJSON(json: string): SpreadSheetController {
    let sheetObject = JSON.parse(json);
    let columns = sheetObject.columns;
    let rows = sheetObject.rows;
    let spreadsheet = new SpreadSheetController(columns, rows);
    spreadsheet.updateSheetFromJSON(json);

    return spreadsheet;
  }
}

export default SpreadSheetController;