/**
 * Cell class
 * @class Cell
 * @classdesc Cell class
 * @export Cell
 * @module src/Engine/Cell
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @param {string[]} formula - The formula of the cell
 * @param {number} value - The value of the cell
 * @param {string} displayString - The display string of the cell
 * @param {string[]} dependsOn - The cells that the cell depends on
 * 
 */
export class Cell {
  // private members
  private formula: string[] = [];
  private value: number = 0;
  private displayString: string = "";
  private dependsOn: string[] = [];

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
      this.formula = [...cell.formula];
      this.value = cell.value;
      this.displayString = cell.displayString.slice();
      this.dependsOn = [...cell.dependsOn];
    } else {
      // default constructor logic
      this.formula = [];
      this.value = 0;
      this.displayString = "";
      this.dependsOn = [];
    }
  }
  
  /** 
   * get the formula of the cell
   * @returns {string[]} The formula of the cell
   *  
   * */
  getFormula(): string[] {
    return this.formula;
  }

  /**
   * set the formula of the cell
   * @param {string[]} formula - The formula of the cell
   * @returns {void}
   *  
   * */
  setFormula(formula: string[]): void {
    this.formula = formula;
  }

  /**
   * get the value of the cell
   * @returns {number} The value of the cell
   *  
   * */
  getValue(): number {
    return this.value;
  }

  /**
   * set the value of the cell
   * @param {number} value - The value of the cell
   * @returns {void}
   * 
   * */
  setValue(value: number): void {
    this.value = value;
  }

  /**
   * get the display string of the cell
   * @returns {string} The display string of the cell
   *  
   * */
  getDisplayString(): string {
    return this.displayString;
  }

  /**
   * set the display string of the cell
   *  
   * @param {string} displayString - The display string of the cell
   * @returns {void}
   *  
   * */
  setDisplayString(displayString: string): void {
    this.displayString = displayString;
  }

  /**
   * get the cells that the cell depends on
   * @returns {string[]} The cells that the cell depends on
   *  
   * */
  getDependsOn(): string[] {
    return this.dependsOn;
  }

  /**
   * set the cells that the cell depends on
   * @param {string[]} dependsOn - The cells that the cell depends on
   * @returns {void}
   *  
   * */
  setDependsOn(dependsOn: string[]): void {
    this.dependsOn = dependsOn;
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

  static convertFromBase26ToBase10(column: string): number
    {
        let result = 0;
        for (let i = 0; i < column.length; i++)
        {
            result *= 26;
            result += column.charCodeAt(i) - 65;
        }
        return result;
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
        const row = parseInt(matches[2])-1;
       
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
    let result = "";
    let temp = column;

    /**
     * 65 is the ASCII code for A
     * 26 is the number of letters in the alphabet
     * 
     * we use do while loop to make sure that the loop runs at least once
     */
    do{
      let remainder = temp % 26;
      temp = Math.floor(temp / 26);
      result = String.fromCharCode(remainder + 65) + result;
    } while(temp > 0);

    /**
     * the label for the cell starts at row 1, but the memory location is 0
     * so we add 1 to the row
     * an concatanate the row to the result
     */
    result += (row + 1).toString();
    return result;
  }


}

export default Cell;