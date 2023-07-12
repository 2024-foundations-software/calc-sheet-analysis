import Cell from "./Cell"
import SheetMemory from "./SheetMemory"
import { ErrorMessages } from "./GlobalDefinitions";



export class FormulaEvaluator {
  // Define a function called update that takes a string parameter and returns a number
  private _errorOccured: boolean = false;
  private _errorMessage: string = "";
  private _currentFormula: FormulaType = [];
  private _lastResult: number = 0;
  private _sheetMemory: SheetMemory | undefined;
  private _error: string = "";
  private _result: number = 0;

  /**
   * 
   * @param formula
   * @returns The value of the expression in the tokenized formula
   * it also provides two properties formulaString and resultString
   * 
   * Uses a recursive descent parser to evaluate the formula
   * 
   * If the formula is empty return an empty string
   * If there is a formula and it is not valid return "error"
   * Otherwise return the value of the formula
   * 
   * The value of the formula is the value of the expression in the formula
   * 
   * The grammar for the formula is:
   * formula = expression
   * expression = term { ("+" | "-") term }
   * term = factor { ("*" | "/") factor }
   * factor = number | "(" expression ")" | cellReference
   * cellReference = a string of letters followed by a string of digits
   * 
   * The value of a number is the number
   * The value of a cellReference is the value of the cell
   * The value of an expression is the value of the first term plus or minus the value of the second term
   * The value of a term is the value of the first factor times or divided by the value of the second factor
   * The value of a factor is the value of the number or the value of the expression in the parentheses or the value of the cellReference
   * 
   * Recalc will be called individually for each cell in the spreadsheet.  
   * The assumption is that any cell is dependent on other cells their values are already calculated.
   * This means that recalc can simply read the value from the memory when it encounters a cellReference
   * 
   */
  evaluate(formula: FormulaType, memory: SheetMemory): [number, string] {

    // make a copy of the formula
    //
    // set the currentFormula to the copy of the formula
    // we do this because the parser consumes the value in currentFormula 
    this._currentFormula = [...formula];
    this._sheetMemory = memory;


    // set the value of result to ""
    let result = "";
    this._lastResult = 0;

    // if the formula is empty return ""
    if (formula.length === 0) {
      this._error = "";
      this._result = 0;
      return [this._lastResult, result];
    }
    // set the errorOccured flag
    this._errorOccured = false;

    // get the value of the expression in the formula
    let resultNumber = this.expression();

    // if an error occured  and the message is PARTIAL return the last resul
    if (this._errorOccured && this._errorMessage === ErrorMessages.partial) {
      const displayString = this._lastResult.toString();
      return [this._lastResult, displayString];
    }

    // if an error occured return the error message
    if (this._errorOccured) {
      return [0, this._errorMessage];
    }

    // otherwise return the value of the expression
    // convert the number result to a string and return it
    const displayString = resultNumber.toString();
    return [resultNumber, displayString];
  }



  public get error(): string {
    return this._error
  }

  public get result(): number {
    return this._result;
  }


  /**
   * 
   * @returns The value of the factor in the tokenized formula
   */
  private expression(): number {
    let result = this.term();
    while (this._currentFormula.length > 0 && (this._currentFormula[0] === "+" || this._currentFormula[0] === "-")) {
      let operator = this._currentFormula.shift();
      let term = this.term();
      if (operator === "+") {
        result += term;

      } else {
        result -= term;
      }
    }
    // set the lastResult to the result
    this._lastResult = result;
    return result;
  }

  /**
   *  
   * @returns The value of the term in the tokenized formula
   *  
   */
  private term(): number {
    let result = this.factor();
    while (this._currentFormula.length > 0 && (this._currentFormula[0] === "*" || this._currentFormula[0] === "/")) {
      let operator = this._currentFormula.shift();
      let factor = this.factor();
      if (operator === "*") {
        result *= factor;
      } else {
        result /= factor;
        if (result === Infinity || result === -Infinity) {
          this._errorOccured = true;
          this._errorMessage = "#DIV/0!";
          this._lastResult = NaN;
        }


      }
    }
    // set the lastResult to the result
    this._lastResult = result;
    return result;
  }

  /**
   *  
   * @returns The value of the factor in the tokenized formula
   * 
   */
  private factor(): number {
    let result = 0;
    // if the formula is empty set errorOccured to true 
    // and set the errorMessage to "PARTIAL"
    // and return 0
    if (this._currentFormula.length === 0) {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.partial;
      return result;
    }

    // get the first token in the formula
    let token = this._currentFormula.shift();

    // if the token is a number set the result to the number
    // and set the lastResult to the number
    if (this.isNumber(token)) {
      result = Number(token);
      this._lastResult = result;

      // if the token is a "(" get the value of the expression
    } else if (token === "(") {
      result = this.expression();
      if (this._currentFormula.length === 0 || this._currentFormula.shift() !== ")") {
        this._errorOccured = true;
        this._errorMessage = ErrorMessages.missingParentheses;
        this._lastResult = result
      }

      // if the token is a cell reference get the value of the cell
    } else if (this.isCellReference(token)) {
      [result, this._errorMessage] = this.getCellValue(token);

      // if the cell value is a number set the result to the number
      if (this._errorMessage !== "") {
        this._errorOccured = true;
        this._lastResult = result;
      }

      // otherwise set the errorOccured flag to true  
    } else {
      this._errorOccured = true;
      this._errorMessage = ErrorMessages.invalidFormula;
    }
    return result;
  }

  /**
   * 
   * @param token 
   * @returns true if the toke can be parsed to a number
   */
  isNumber(token: TokenType): boolean {
    return !isNaN(Number(token));
  }

  /**
   * 
   * @param token
   * @returns true if the token is a cell reference
   * 
   */
  isCellReference(token: TokenType): boolean {

    return Cell.isValidCellLabel(token);
  }

  /**
   * 
   * @param token
   * @returns [value, ""] if the cell formula is not empty
   * @returns [0, "UNDEF"] if the cell formula is empty
   * 
   */
  getCellValue(token: TokenType): [number, string] {

    if (this._sheetMemory === undefined) {
      throw new Error("Sheet memory is undefined");
    }
    let cell = this._sheetMemory.getCellByLabel(token);
    let formula = cell.getFormula();
    if (formula.length === 0) {
      return [0, ErrorMessages.invalidCell];
    }
    let value = cell.getValue();
    return [value, ""];

  }


}

export default FormulaEvaluator;