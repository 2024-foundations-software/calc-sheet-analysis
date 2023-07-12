import SheetMemory from "./SheetMemory"
import FormulaEvaluator from "./FormulaEvaluator"
import DependencyManager from "./DependencyManager"
import FormulaBuilder from "./FormulaBuilder";
import Cell from "./Cell";
import CalcSheetServerClient from "../DataStore/src/CalcSheetServerClient";




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
 * setWorkingCell( column:number, row_number)): void
 * 
 * getSheetValues(void): string[][]
 * 
 * 
 * 
 */
export class SpreadSheetEngine {
  /** The memory for the sheet */
  private _memory: SheetMemory;

  /** The current cell */
  private _currentWorkingRow = 0;
  private _currentWorkingColumn = 0;


  /**
   * The components that the SpreadSheetEngine uses to manage the sheet
   * 
   */

  // The formula evaluator, this is used to evaluate the formula for the current cell
  // it is only called for a cell when all cells it depends on have been evaluated
  private _formulaEvaluator: FormulaEvaluator = new FormulaEvaluator();

  // The formula builder, this is used to build the formula for the current cell
  // it is used when the user is editing the formula for the current cell
  private _formulaBuilder: FormulaBuilder = new FormulaBuilder();

  // The current cell is being edited
  private _cellIsBeingEdited: boolean = false;

  // The dependency manager, this is used to manage the dependencies between cells
  // The main job of this is to compute the order in which the cells should be evaluated
  private _dependencyManager: DependencyManager = new DependencyManager();



  private portForServer: number = 3005;

  private calcSheetServerClient: CalcSheetServerClient = new CalcSheetServerClient(this.portForServer);



  /**
   * constructor
   * */
  constructor(columns: number, rows: number) {
    this._memory = new SheetMemory(columns, rows);
  }

  /**
   * restart the machine
   */
  public restart(): void {
    this._memory = new SheetMemory(this._memory.getMaxColumns(), this._memory.getMaxRows());
    this._currentWorkingRow = 0;
    this._currentWorkingColumn = 0;
    this._cellIsBeingEdited = false;
    this._formulaBuilder = new FormulaBuilder();
    this._dependencyManager = new DependencyManager();
  }

  /**
   * handle a key press
   *  
   *  @param key:string
   */
  public processKey(key: string): void {

    // if the key is a number or a parenthesis or a decimal point add it to the formula
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "(", ")"].includes(key)) {
      this.addToken(key);
      this._cellIsBeingEdited = true;
      this._dependencyManager.evaluateSheet(this._memory);
      return;
    }

    // if the key is an operator add it to the formula
    if (["+", "-", "*", "/"].includes(key)) {
      this.addToken(key);
      this._cellIsBeingEdited = true;
      this._dependencyManager.evaluateSheet(this._memory);
      return;
    }

    // if the key is backspace or delete remove the last token from the formula
    if (["Backspace", "Delete"].includes(key)) {
      this.removeToken();
      this._cellIsBeingEdited = true;
      this._dependencyManager.evaluateSheet(this._memory);
      return;
    }


  }


  public async processCommandButton(command: string): Promise<void> {
    if (command === 'save') {
      let documentToSend: CalcSheetDocument = {
        numberOfRows: this._memory.getMaxRows(),
        numberOfColumns: this._memory.getMaxColumns(),
        formulas: this._memory.getSheetFormulas(),
      };
      try {
        await this.calcSheetServerClient.sendDocument(documentToSend);
      } catch (error) {
        console.error('error-------->: ' + error);
      }
    }
    if (command === 'load') {
      let documentID = '5366e13f-929b-464e-a408-31c14250daee';
      try {
        let result = await this.calcSheetServerClient.getDocument(documentID);
        if (result) {
          let newFormulas = result.formulas;

          this._memory.setSheetFormulas(newFormulas);

          this._dependencyManager.updateDependencies(this._memory);
          this._dependencyManager.evaluateSheet(this._memory);
        } else {
          console.error('document not found');
        }
      } catch (error) {
        console.error('error-------->: ' + error);
      }
    }
  }

  /**  
   *  add token to current formula, this is not a cell and thus no dependency updating is needed
   * 
   * @param token:string
   * Inform the memory that the current cell formula has changed
   * 
   */
  addToken(token: string): void {
    // add the token to the formula
    this._formulaBuilder.addToken(token);
    // update the memory with the new formula
    let formula = this._formulaBuilder.getFormula();
    this._memory.setCurrentCellFormula(formula);
    // Do a recalc
    this._dependencyManager.evaluateSheet(this._memory);
  }

  /**  
   *  add cell reference to current formula
   * 
   * @param cell:string
   * Assuming that the dependents have been updated
   * we will look at the dependsOn array for the cell being inserted
   * if the current cell is in the dependsOn array then we have a circular reference
   * 
   */
  addCell(cell_reference: string): void {

    // get the dependents for the cell being inserted

    if (cell_reference === this.getCurrentCellLabel()) {
      // do nothing
      return;
    }

    let cell: Cell = this._memory.getCellByLabel(cell_reference);

    // get the dependents for the current cell
    let dependents = cell.getDependsOn();

    let currentLabel = Cell.columnRowToCell(this._currentWorkingColumn, this._currentWorkingRow);


    // if the cell reference is not in the dependents use add token
    if (!dependents.includes(currentLabel)) {
      this.addToken(cell_reference);
    } else {
      // do nothing
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
    this._dependencyManager.evaluateSheet(this._memory);
  }

  /**
   * 
   * clear the current formula
   * 
   */
  clearFormula(): void {
    this._formulaBuilder.setFormula([]);
    this._memory.setCurrentCellFormula(this._formulaBuilder.getFormula());
    this._dependencyManager.evaluateSheet(this._memory);
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
    let currentFormula = this._formulaBuilder.getFormula();
    const [, displayString] = this._formulaEvaluator.evaluate(currentFormula, this._memory);
    return displayString;
  }


  /** 
   * set the working cell by label
   * 
   * @param label:string
   * 
   * 
   */
  setCurrentCellByLabel(label: string): void {
    const [column, row] = Cell.cellToColumnRow(label);
    this.setCurrentCellByCoordinates(column, row);
  }


  /**
   * get the current cell label
   * 
   * @returns the current cell label
   * 
   */
  getCurrentCellLabel(): string {
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
  setCurrentCellByCoordinates(column: number, row: number): void {
    // if the cell is the same as the current cell do nothing
    if (column === this._currentWorkingColumn && row === this._currentWorkingRow) return;

    // get the current formula from the formula builder
    let currentFormula = this._formulaBuilder.getFormula();
    this._memory.setCurrentCellFormula(currentFormula);

    // get the formula from the new cell
    this._memory.setCurrentCellCoordinates(column, row);
    currentFormula = this._memory.getCurrentCellFormula();
    this._formulaBuilder.setFormula(currentFormula);

    this._currentWorkingColumn = column;
    this._currentWorkingRow = row;

    this._memory.setCurrentCellCoordinates(column, row);

  }

  /**
   * Get the Sheet Display Values
   *  
   * @returns string[][]
   */
  public getSheetDisplayStrings(): string[][] {
    return this._memory.getSheetDisplayStrings();
  }

  /**
    * Get the Sheet Display Values
    * the GUI needs the data to be in row major order
    * 
    * @returns string[][]
    */
  public getSheetDisplayStringsForGUI(): string[][] {
    this._dependencyManager.updateComputationOrder(this._memory);
    this._dependencyManager.evaluateSheet(this._memory);

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
      return "editing: " + this.getCurrentCellLabel();
    }
    return "current cell: " + this.getCurrentCellLabel();
  }


  /**
   * update the current formula of the machine with the input cell formula
   * 
   * */
  public updateCurrentFormula(cellLabel: string): void {
    const cell = this._memory.getCellByLabel(cellLabel);

    const formula = cell.getFormula();
    this._formulaBuilder.setFormula(formula);
  }




}

export default SpreadSheetEngine;