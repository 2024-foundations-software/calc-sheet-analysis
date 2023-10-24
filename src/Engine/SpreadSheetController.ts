import SheetMemory from "./SheetMemory"
import FormulaEvaluator from "./NewFormulaEvaluator"
import CalculationManager from "./CalculationManager"
import FormulaBuilder from "./FormulaBuilder";
import Cell from "./Cell";
import { ContributingUser } from "./ContributingUser";

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



  /** the users who are editing this sheet */

  private _contributingUsers: Map<string, ContributingUser> = new Map<string, ContributingUser>();
  private _cellsBeingEdited: Map<string, string> = new Map<string, string>();


  // The dependency manager, this is used to manage the dependencies between cells
  // The main job of this is to compute the order in which the cells should be evaluated
  private _calculationManager: CalculationManager;

  // a per access error message
  private _errorOccurred: string = '';

  /**
   * constructor
   * */
  constructor(columns: number, rows: number) {
    this._memory = new SheetMemory(columns, rows);
    this._calculationManager = new CalculationManager();
  }

  requestViewAccess(user: string, cellLabel: string) {
    // if it does not exist them make and give view access
    let userData: ContributingUser;

    if (!this._contributingUsers.has(user)) {
      userData = new ContributingUser(cellLabel)

    } else {
      userData = this._contributingUsers.get(user)!;
      userData.cellLabel = cellLabel;
    }

    this.releaseEditAccess(user);
    userData.isEditing = false;
    this._contributingUsers.set(user, userData);
    userData.formulaBuilder.setFormula(this._memory.getCellByLabel(cellLabel).getFormula());
  }



  requestEditAccess(user: string, cellLabel: string): boolean {
    this._errorOccurred = '';

    // is the user a contributingUser for this document. // this is for testing
    if (!this._contributingUsers.has(user)) {
      throw new Error('User is not a contributing user, this should not happen for a request to edit');
    }

    // now we know that the user is a viewer for sure and this line will succeed
    let userData = this._contributingUsers.get(user);

    // Is the user editing another cell? If so then release the other cell
    if (userData!.isEditing && userData!.cellLabel !== cellLabel) {
      this.releaseEditAccess(user);
    }

    // at this point the user is a contributing user and is not editing another cell
    // make them a viewer of this cell
    userData!.cellLabel = cellLabel;

    // if the cell is not being edited then we can edit it
    if (!this._cellsBeingEdited.has(cellLabel)) {
      userData!.isEditing = true;
      this._cellsBeingEdited.set(cellLabel, user);
      return true;
    }

    // if the cell is being edited by this user then return true
    if (this._cellsBeingEdited.get(cellLabel) === user) {
      return true;
    }

    // at this point we cannot assign the user as an editor
    const otherUser = this._cellsBeingEdited.get(cellLabel);
    this._errorOccurred = `Cell is being edited by ${otherUser}`;
    return false;
  }



  releaseEditAccess(user: string): void {
    // if the user is not editing a cell then we are done
    if (!this._contributingUsers.get(user)?.isEditing) {
      return;
    }

    const editingCell: string | undefined = this._contributingUsers.get(user)?.cellLabel;
    if (editingCell) {
      if (this._cellsBeingEdited.has(editingCell)) {
        this._cellsBeingEdited.delete(editingCell);
      }
    }

    // // remove the user from the list of users
    // this._contributingUsers.delete(user);

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
  addToken(token: string, user: string): void {
    // is the user editing a cell
    const userData = this._contributingUsers.get(user)!;
    if (!userData.isEditing) {
      return;
    }

    // add the token to the formula
    userData.formulaBuilder.addToken(token);
    let cellBeingEdited = this._contributingUsers.get(user)?.cellLabel;


    let cell = this._memory.getCellByLabel(cellBeingEdited!);
    cell.setFormula(userData.formulaBuilder.getFormula());
    this._memory.setCellByLabel(cellBeingEdited!, cell);

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
  addCell(cellReference: string, user: string): void {
    this._errorOccurred = '';

    // is the user editing a cell
    const userEditing = this._contributingUsers.get(user)

    // If the user is not editing then we are done
    if (!userEditing!.isEditing) {
      return;
    }

    // if the cell being edited is the same as the cell being inserted then do nothing
    if (cellReference === userEditing!.cellLabel) {
      return;
    }

    // add the cell reference to the formula
    let currentCell: Cell = this._memory.getCellByLabel(userEditing!.cellLabel)
    let currentLabel = userEditing!.cellLabel;

    // Check to see if we would be introducing a circular dependency
    // this function will update the dependency for the cell being inserted
    let okToAdd = this._calculationManager.okToAddNewDependency(currentLabel, cellReference, this._memory);

    // We have checked to see if this new token introduces a circular dependency
    // if it does not then we can add the token to the formula
    if (okToAdd) {
      this.addToken(cellReference, user);
      return;
    }
    this._errorOccurred = `Circular dependency detected, ${currentLabel} cannot depend on ${cellReference}`;

  }



  /**
   * 
   * remove the last token from the current formula
   * 
   */


  removeToken(user: string): void {
    const userEditing = this._contributingUsers.get(user);

    if (!userEditing!.isEditing) {
      return;
    }

    userEditing!.formulaBuilder.removeToken();
    let cellBeingEdited = this._contributingUsers.get(user)?.cellLabel;

    let cell = this._memory.getCellByLabel(cellBeingEdited!);
    cell.setFormula(userEditing!.formulaBuilder.getFormula());
    this._memory.setCellByLabel(cellBeingEdited!, cell);

    this._calculationManager.evaluateSheet(this._memory);
  }

  /**
   * 
   * clear the current formula only the owner can 
   * 
   */
  clearFormula(user: string): void {

    const userEditing = this._contributingUsers.get(user);
    if (!userEditing || !userEditing!.isEditing) {
      return;
    }

    userEditing!.formulaBuilder.setFormula([]);
    let cellBeingEdited = this._contributingUsers.get(user)?.cellLabel;

    // this should not empty but just in case throw error
    if (cellBeingEdited) {
      let cell = this._memory.getCellByLabel(cellBeingEdited);
      cell.setFormula(userEditing!.formulaBuilder.getFormula());
      this._memory.setCellByLabel(cellBeingEdited, cell);
    }
    this._calculationManager.evaluateSheet(this._memory);
  }

  /**
   * 
   * get the formula string for the user.  
   * 
   * The formula string is the cell that the user is editing or watching
   * 
   * @param user:string
   * 
   * @returns the formula as a string
   */
  getFormulaStringForUser(user: string): string {
    const userData = this._contributingUsers.get(user);

    // get the data from the cell, it is the authority
    const cell = this._memory.getCellByLabel(userData!.cellLabel);
    // update the formulaBuilder (if this is a watcher then it updates from the cell)
    userData!.formulaBuilder.setFormula(cell.getFormula());
    const formula = userData!.formulaBuilder.getFormulaString();
    return formula;
  }

  /**
   * Get the result string for the user
   * 
   * @param user:string
   * 
   * @returns the formula as a value:string
   */
  getResultStringForUser(user: string): string {
    const userEditing = this._contributingUsers.get(user);

    let cell = this._memory.getCellByLabel(userEditing!.cellLabel);
    let displayString = cell.getDisplayString();

    return displayString;
  }


  /**
   * get the current cell label
   * 
   * @returns the current cell label
   * 
   */
  getWorkingCellLabel(user: string): string {
    const userEditing = this._contributingUsers.get(user);

    return userEditing!.cellLabel;

  }


  /**
   * 
   * @param user 
   * @returns 
   */
  public documentContainer(user: string): any {
    // get the current formula for the cell of this user
    let container = this._memory.sheetContainer();

    // if the user is not a contributing user we request view access to A1
    if (!this._contributingUsers.has(user)) {
      this.requestViewAccess(user, 'A1');
    }
    let userData = this._contributingUsers.get(user)!;
    let cellFocused = userData.cellLabel;
    container.currentCell = cellFocused;
    container.formula = this.getFormulaStringForUser(user);
    container.result = this.getResultStringForUser(user);
    container.isEditing = userData.isEditing;

    // add the error message if there is one
    container.errorOccurred = this._errorOccurred;
    // reset the error since we only report it once
    this._errorOccurred = '';

    container.contributingUsers = [];
    this._contributingUsers.forEach((value: ContributingUser, key: string) => {
      let user = {
        user: key,
        cell: value.cellLabel,
        isEditing: value.isEditing
      }
      if (value.isEditing) {
        container.contributingUsers.push(user);
      }
    });
    return container;
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