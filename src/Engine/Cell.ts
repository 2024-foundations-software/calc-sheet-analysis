/**
 * Cell class
 * @class Cell
 * @classdesc Cell class
 * @export Cell
 * @module src/Engine/Cell
 * 
 * 
 */
export class Cell {
  // private members

  // the formula for the cell expressed as a string of tokens
  // this is built by the formula builder in response to the user editing the formula
  // in the react app
  private _formula: string[] = [];

  // the value of the cell
  private _value: number = 0;

  // the display string for the cell, it is either the value or an error message
  private _displayString: string = "";

  // the cells that the cell depends on (extracted from the formula)
  private _dependsOn: string[] = [];

  // the cells that depend on this cell (extracted from the formula)
  private _children: string[] = [];

  /**
   * constructor
   * @constructor

   * 
   * @returns {void}
   * 
   * */
  constructor(cell?: Cell) {
    if (cell) {
      // copy constructor logic
      this._formula = [...cell._formula];
      this._value = cell._value;
      this._displayString = cell._displayString.slice();
      this._dependsOn = [...cell._dependsOn];
      this._children = [...cell._children];
    } else {
      // default constructor logic
      this._formula = [];
      this._value = 0;
      this._displayString = "";
      this._dependsOn = [];
      this._children = [];
    }
  }

  /** 
   * get the formula of the cell
   * @returns {string[]} The formula of the cell
   *  
   * */
  getFormula(): string[] {
    return this._formula;
  }

  /**
   * set the formula of the cell
   * @param {string[]} formula - The formula of the cell
   * @returns {void}
   *  
   * */
  setFormula(formula: string[]): void {
    this._formula = formula;
  }

  /**
   * get the value of the cell
   * @returns {number} The value of the cell
   *  
   * */
  getValue(): number {
    return this._value;
  }

  /**
   * set the value of the cell
   * @param {number} value - The value of the cell
   * @returns {void}
   * 
   * */
  setValue(value: number): void {
    this._value = value;
  }

  /**
   * get the display string of the cell
   * @returns {string} The display string of the cell
   *  
   * */
  getDisplayString(): string {
    return this._displayString;
  }

  /**
   * set the display string of the cell
   *  
   * @param {string} displayString - The display string of the cell
   * @returns {void}
   *  
   * */
  setDisplayString(displayString: string): void {
    this._displayString = displayString;
  }

  /**
   * get the cells that the cell depends on
   * @returns {string[]} The cells that the cell depends on
   *  
   * */
  getDependsOn(): string[] {
    return this._dependsOn;
  }

  /**
   * set the cells that the cell depends on
   * @param {string[]} dependsOn - The cells that the cell depends on
   * @returns {void}
   *  
   * */
  setDependsOn(dependsOn: string[]): void {
    this._dependsOn = dependsOn;
  }

  /**
   * get the cells that depend on this cell
   * @returns {string[]} The cells that depend on this cell
   *  
   * */
  getChildren(): string[] {
    return this._children;
  }

  /**
   * set the cells that depend on this cell
   * @param {string[]} children - The cells that depend on this cell
   * @returns {void}
   * 
   * */
  setChildren(children: string[]): void {
    this._children = children;
  }

  /**
   * add a child cell
   * @param {string} cell - The cell that the cell depends on
   * @returns {void}
   * 
   * */
  public addChild(child: string): void {
    this._children.push(child);
  }

  /**
   * remove a child cell  
   * @param {string} cell - The cell that the cell depends on
   * @returns {void}
   * 
   * */
  public removeChild(child: string): void {
    const index = this._children.indexOf(child);
    if (index > -1) {
      this._children.splice(index, 1);
    }
  }


  //** static methods. */


  /**
   * check if the cell name is valid
   * @param {string} cell - The cell name
   * @returns {boolean} true if the cell name is valid, false otherwise
   *  
   * */
  public static isValidCellLabel(cell: string): boolean {
    let regex = /^[A-Z][1-9][0-9]?$/;
    return regex.test(cell);
  }

  static convertFromBase26ToBase10(column: string): number {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result *= 26;
      result += column.charCodeAt(i) - 65;
    }
    return result;
  }


  /**
   * 
   * @param column 
   * @returns the column name in base 26 represented with A=0 and Z=25
   */
  public static columnNumberToName(column: number): string {
    /**
 * 65 is the ASCII code for A
 * 26 is the number of letters in the alphabet
 * 
 * we use do while loop to make sure that the loop runs at least once
 */
    let temp = column;
    let result = "";
    do {
      let remainder = temp % 26;
      temp = Math.floor(temp / 26);
      result = String.fromCharCode(remainder + 65) + result;
    } while (temp > 0);
    return result;
  }

  /**
   * 
   * @param row
   * @returns the row name in base 10 represented with 0=0 and 9=9
   * 
   * The labels for the cells are 1 based so we add 1 to the row number
   * 
   */
  public static rowNumberToName(row: number): string {
    return (row + 1).toString();
  }

  /**
   * return the column and row for a cell 
   * @param {string} cell - The cell name
   * @returns {number[]} The column and row for a cell
   * 
   * */
  public static cellToColumnRow(label: string): number[] {
    // Split the label into the column and row
    // The column is the first characters of the label (the letters)
    // The row is the last characters of the label (the numbers)


    const labelREGEX = (/^([A-Z]+)([0-9]+)$/);
    const matches = label.match(labelREGEX);

    if (matches === null) {
      throw new Error("Invalid cell name");
    }
    const column = Cell.convertFromBase26ToBase10(matches[1]);
    const row = parseInt(matches[2]) - 1;

    return [column, row];
  }

  /**
   * return the label for a cell
   * @param {number} column - The column for a cell
   * @param {number} row - The row for a cell
   * @returns {string} The label for a cell
   * 
   */
  public static columnRowToCell(column: number, row: number): string {
    // Convert the column to base 26
    // Convert the row to a string
    // Concatenate the column and row
    // Return the result

    let columnString = Cell.columnNumberToName(column);

    /**
     * the label for the cell starts at row 1, but the memory location is 0
     * so we add 1 to the row
     * an concatanate the row to the result
     */
    let rowString = Cell.rowNumberToName(row);

    let result = columnString + rowString;
    return result;
  }


}

export default Cell;