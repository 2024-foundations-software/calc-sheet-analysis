/**
 * @module DocumentGenerator
 * @description This module is responsible for generating fake spreadsheet documents
 * 
 * a spreadsheet is an array of rows
 * a row is an array of cells
 * a cell is a list of tokens that are mathematical expressions using the following operators: +, -, *, /  it also includes numbers and references to other cells
 * 
 * for the purposes of this test the following assumptions are made:
 * 
 * the formulas do not need to be validated.  we are simply storing them on a server and testing that the read and write operations work
 * 
 */



export class DocumentGenerator {

  constructor() {
  }

  /**
   * @function generateDocument
   * @description generates a document with the specified number of rows and columns
   * @param {number} numberOfRows
   * @param {number} numberOfColumns
   * @returns {CalcSheetDocument}
   *  
   * @example
   * 
   * const document = generateDocument(3, 3);
   * 
   * // document = {
   * //   numberOfRows: 3,
   * //   numberOfColumns: 3,
   * //   formulas: [
   * //     [
   * //       [["1"], ["2"], ["3" "+", "1"]],
   * //       [["4"], ["5"], ["6"]],
   * //       [["7"], ["8"], ["9"]]
   * //     ]
   * //   ]
   * // }
   * */
  generateDocument(numberOfRows?: number, numberOfColumns?: number): CalcSheetDocument {
    if (!numberOfRows) {
      numberOfRows = Math.floor(Math.random() * 8) + 3;
    }

    if (!numberOfColumns) {
      numberOfColumns = Math.floor(Math.random() * 8) + 3;
    }

    const document: CalcSheetDocument = {
      numberOfRows,
      numberOfColumns,
      formulas: [],
    };

    for (let i = 0; i < numberOfRows; i++) {
      const row: string[][] = [];
      for (let j = 0; j < numberOfColumns; j++) {
        row.push(this.generateCell());
      }
      document.formulas.push(row);
    }

    return document;
  }


  /**
   * @function generateCell
   * @description generates a cell with a random number of tokens
   * @returns {string[]}
   *  
   * @example
   * 
   * const cell = generateCell();
   *  
   * // cell = [["1"], ["2"], ["3" "+", "1"]]
   * */

  generateCell(): string[] {
    const numberOfTokens = Math.floor(Math.random() * 10);
    const tokens: string[] = [];
    for (let i = 0; i < numberOfTokens; i++) {
      tokens.push(this.generateToken());
    }
    return tokens;
  }

  /**
   * @function generateToken
   * @description generates a token that is either a number, a reference to another cell, or a mathematical operator
   * @returns {string}
   * 
   * @example
   * 
   * const token = generateToken();
   * 
   * // token = "1"
   * 
   * const token = generateToken();
   * 
   * // token = "A1"
   * 
   * const token = generateToken();
   * 
   * // token = "+"
   * */

  generateToken(): string {
    const tokenType = Math.floor(Math.random() * 3);
    let result: string = "";
    switch (tokenType) {
      case 0:
        result = this.generateNumber();
        break;
      case 1:
        result = this.generateReference();
        break;
      case 2:
        result = this.generateOperator();
        break;
    }
    return result;
  }

  /**
   * @function generateNumber
   * @description generates a random number between 0 and 100
   * @returns {string}
   * */
  generateNumber(): string {
    return Math.floor(Math.random() * 100).toString();
  }

  /**
   * @function generateReference
   * @description generates a random reference to another cell
   * @returns {string}
   * 
   * @example
   * 
   * const reference = generateReference();
   * 
   * // reference = "A1"
   * */
  generateReference(): string {
    const row = Math.floor(Math.random() * 10);
    const column = Math.floor(Math.random() * 10);
    return `${this.generateColumnLetter(column)}${row}`;
  }

  /**
   * @function generateOperator
   * @description generates a random mathematical operator
   * @returns {string}
   * 
   * @example
   * 
   * const operator = generateOperator();
   * 
   * // operator = "+"
   * 
   * const operator = generateOperator();
   *  
   * // operator = "-"
   * */
  generateOperator(): string {
    const operators = ["+", "-", "*", "/"];
    return operators[Math.floor(Math.random() * 4)];
  }

  /**
   * @function generateColumnLetter
   * @description generates a column letter from a column number
   * @param {number} columnNumber
   * @returns {string}
   *  
   * @example
   * 
   * const columnLetter = generateColumnLetter(0);
   * 
   * // columnLetter = "A"
   * 
   * const columnLetter = generateColumnLetter(1);
   * 
   * // columnLetter = "B"
   * 
   * const columnLetter = generateColumnLetter(25);
   * 
   * // columnLetter = "Z"
   * 
   * const columnLetter = generateColumnLetter(26);
   * 
   * // columnLetter = "AA"
   * 
   * */

  generateColumnLetter(columnNumber: number): string {
    let columnLetter = "";
    while (columnNumber >= 0) {
      columnLetter = String.fromCharCode(columnNumber % 26 + 65) + columnLetter;
      columnNumber = Math.floor(columnNumber / 26) - 1;
    }
    return columnLetter;
  }

  /**
   * #function compare spreadsheets
   * 
   * @description compares two spreadsheets and returns true if they are equal
   */

  compareSpreadsheets(spreadsheet1: CalcSheetDocument, spreadsheet2: CalcSheetDocument): boolean {
    if (spreadsheet1.numberOfRows !== spreadsheet2.numberOfRows) {
      return false;
    }

    if (spreadsheet1.numberOfColumns !== spreadsheet2.numberOfColumns) {
      return false;
    }

    for (let i = 0; i < spreadsheet1.numberOfRows; i++) {
      for (let j = 0; j < spreadsheet1.numberOfColumns; j++) {
        if (!this.compareCells(spreadsheet1.formulas[i][j], spreadsheet2.formulas[i][j])) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * #function compare cells
   *  
   * @description compares two cells and returns true if they are equal
   * */

  compareCells(cell1: string[], cell2: string[]): boolean {
    if (cell1.length !== cell2.length) {
      return false;
    }

    for (let i = 0; i < cell1.length; i++) {
      if (cell1[i] !== cell2[i]) {
        return false;
      }
    }

    return true;
  }

}

export default DocumentGenerator;

