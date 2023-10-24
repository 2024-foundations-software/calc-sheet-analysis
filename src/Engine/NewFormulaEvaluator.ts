/** A recursive descent parser to deal with the following grammar
 * 
 * binary operators +, -, *, /
 * unary operator -
 * 
 * postfix operators % +/- sin cos tan asin acos atan sqrt pow sqr
 * 
 * formula = expression
 * expression = term { ("+" | "-") term }
 * term = factor { ("*" | "/") factor }
 * factor = number | "(" expression ")" | unary_op factor | factor postfix_op   
 * unary_op = "-"
 * postfix_op = ["+/-", "sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "sqr", "cube", "1/x", "cuberoot"]
 * 
 * 
 * 
 */

import Cell from "./Cell"
import SheetMemory from "./SheetMemory"
import { ErrorMessages } from "./GlobalDefinitions";

class FormulaEvaluator {
    private _errorOccurred: boolean = false;
    private _errorMessage: string = "";
    private _currentFormula: FormulaType = [];
    private _lastResult: number = 0;
    private _sheetMemory: SheetMemory;
    private _result: number = 0;
    private _postfixOperators = ["+/-", "sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "sqr", "cube", "1/x", "cuberoot"]

    constructor(memory: SheetMemory) {
        this._sheetMemory = memory;
    }

    evaluate(formula: FormulaType) {
        this._errorOccurred = false;
        // make a copy of the formula
        //
        // set the currentFormula to the copy of the formula
        // we do this because the parser consumes the value in currentFormula 
        this._currentFormula = [...formula];

        if (this._currentFormula.length === 0) {
            this._result = 0;

            this._errorMessage = ErrorMessages.emptyFormula;
            return;
        }

        this._errorMessage = "";
        let resultValue = this.expression();
        this._result = resultValue;

        // if there are still tokens in the formula set the errorOccurred flag
        // if an error has occurred then we dont update the error message
        if (this._currentFormula.length > 0 && !this._errorOccurred) {
            this._errorOccurred = true;
            this._errorMessage = ErrorMessages.invalidFormula;
        }

        // if an error occurred  and the message is PARTIAL return the last result
        if (this._errorOccurred) {
            this._result = this._lastResult;
        }
    }
    public get error(): string {
        return this._errorMessage
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
            if (operator === "+") {
                result += this.term();
            } else {
                result -= this.term();
            }
        }
        this._lastResult = result;
        return result;
    }

    /**
     * 
     * @returns The value of the term in the tokenized formula
     */
    private term(): number {
        let result = this.factor();
        while (this._currentFormula.length > 0 && (this._currentFormula[0] === "*" || this._currentFormula[0] === "/")) {
            let operator = this._currentFormula.shift();
            let factor = this.factor();
            if (operator === "*") {
                result *= factor;
            } else {
                // check for divide by zero
                if (factor === 0) {
                    this._errorOccurred = true;
                    this._errorMessage = ErrorMessages.divideByZero;
                    this._lastResult = Infinity;
                    return Infinity;
                }
                // we are ok, lets divide
                result /= factor;
            }
        }
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
        // if the formula is empty set errorOccurred to true 
        // and set the errorMessage to "PARTIAL"
        // and return 0
        if (this._currentFormula.length === 0) {
            this._errorOccurred = true;
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
                this._errorOccurred = true;
                this._errorMessage = ErrorMessages.missingParentheses;
                this._lastResult = result
            }

            // if the token is a cell reference get the value of the cell
        } else if (this.isCellReference(token)) {
            [result, this._errorMessage] = this.getCellValue(token);

            // if the cell value is a number set the result to the number
            if (this._errorMessage !== "") {
                this._errorOccurred = true;
                this._lastResult = result;
            }

        } else if (token === "rand") {
            result = Math.random();
        } else if (token === "-") {
            result = -this.factor();
        } else if (token === "+") {
            result = this.factor();
        } else {
            this._errorOccurred = true;
            this._errorMessage = ErrorMessages.invalidFormula;
        }

        result = this.postfix(result);
        return result;
    }

    /**
     * 
     * @param token 
     * @returns The value of the postfix operation
     */
    private postfix(currentValue: number): number {
        let result = currentValue;

        if (this._currentFormula.length === 0) {
            return result;
        }

        let tokenPeek = this._currentFormula[0];

        if (this._postfixOperators.includes(tokenPeek)) {
            let token = this._currentFormula.shift();
            result = this.postfixOperation(token, result);


        }
        // see if there is another postfix operator
        tokenPeek = this._currentFormula[0];
        if (this._postfixOperators.includes(tokenPeek)) {
            result = this.postfix(result);
        }

        return result;
    }

    private postfixOperation(token: TokenType, currentValue: number): number {

        let result = currentValue;
        if (token === "+/-") {
            result = -currentValue;
        } else if (token === "sin") {
            result = Math.sin(currentValue);
        } else if (token === "cos") {
            result = Math.cos(currentValue);
        } else if (token === "tan") {
            result = Math.tan(currentValue);
        } else if (token === "asin") {
            result = Math.asin(currentValue);
        } else if (token === "acos") {
            result = Math.acos(currentValue);
        } else if (token === "atan") {
            result = Math.atan(currentValue);
        } else if (token === "sqrt") {
            result = Math.sqrt(currentValue);
        } else if (token === "cuberoot") {
            result = Math.pow(currentValue, 1.0 / 3.0);
        } else if (token === "sqr") {
            result = Math.pow(currentValue, 2);
        } else if (token === "cube") {
            result = Math.pow(currentValue, 3);
        } else if (token === "1/x") {
            if (currentValue === 0) {
                this._errorOccurred = true;
                this._errorMessage = ErrorMessages.divideByZero;
                this._lastResult = Infinity;
                return Infinity;
            }
            result = 1.0 / currentValue;
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
     * @returns [value, ""] if the cell formula is not empty and has no error
     * @returns [0, error] if the cell has an error
     * @returns [0, ErrorMessages.invalidCell] if the cell formula is empty
     * 
     */
    getCellValue(token: TokenType): [number, string] {

        let cell = this._sheetMemory.getCellByLabel(token);
        let formula = cell.getFormula();
        let error = cell.getError();

        // if the cell has an error return 0
        if (error !== "" && error !== ErrorMessages.emptyFormula) {
            return [0, error];
        }

        // if the cell formula is empty return 0
        if (formula.length === 0) {
            return [0, ErrorMessages.invalidCell];
        }


        let value = cell.getValue();
        return [value, ""];

    }
}
export default FormulaEvaluator;

