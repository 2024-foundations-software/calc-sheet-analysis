/** SheetMemory Class
 * 
 * This class is used to maintain an 2d array of CellClass objects.
 * 
 * The SheetMemory class is used to store the formulas and values of the cells in the spreadsheet.
 * 
 * The SheetMemory class is used by the Sheet class to store the formulas and values of the cells in the spreadsheet.
 * 
 * The array of cells is private and can only be accessed through the SheetMemory class.
 * 
 * This class provides a way to get and set the cells in the array.
 * 
 * This class calculates a dependency graph of the cells in the spreadsheet.
 * 
 * This class provides a way to evaluate the formulas in the cells.
 * 
 * This class provides a way to get the formulas and values of the cells in the spreadsheet.
 * 
 * This Class provides a way to get and set the current cell.
 * 
 * This class provides a way to evaluate the formula for the current cell. It uses Recalc.ts to evaluate the formula.
 * 
 * 
 * 
 * 
 */
import { ErrorMessages } from "./GlobalDefinitions";
import FormulaEvaluator from "./FormulaEvaluator";
import Cell from "./Cell";

export class SheetMemory {
    private cells: Cell[][];
    private maxRows = 8;
    private maxColumns = 8;

    private currentRow = 0;
    private currentColumn = 0;


    constructor(columns: number, rows: number) {

        this.maxColumns = columns;
        this.maxRows = rows;

        this.cells = [];
        for (let column = 0; column < this.maxColumns; column++) {
            this.cells[column] = [];
            for (let row = 0; row < this.maxRows; row++) {
                let cell = new Cell();
                cell.setLabel(Cell.columnRowToCell(column, row));
                this.cells[column][row] = cell;
            }
        }
    }

    /**
     * getter for max rows
     * 
     * @returns the max rows
     *  
     * */
    getMaxRows(): number {
        return this.maxRows;
    }

    /**
    * getter for max columns
    *   
    * @returns the max columns
    * 
    * */
    getMaxColumns(): number {
        return this.maxColumns;
    }


    /**
     *  get coordinates of current cell
     * returns an array of [row, column]
     * */
    getCurrentCellCoordinates(): number[] {
        return [this.currentColumn, this.currentRow];
    }

    /**
     * sets the current cell to be the cell at the coordinates
     * 
     * @param row
     * @param column
     * @param cell
     * */
    setCurrentCellCoordinates(column: number, row: number): void {
        this.currentRow = row;
        this.currentColumn = column;
    }

    /**
     * sets the current cell to be the cell at label
     * 
     * @param label
     * 
     */
    setCurrentCellLabel(label: string): void {
        const [column, row] = Cell.cellToColumnRow(label);
        this.setCurrentCellCoordinates(column, row);
    }

    /**
     * set the current cell
     * 
     * @param cell
     */
    setCurrentCell(cell: Cell): void {
        this.cells[this.currentColumn][this.currentRow] = cell;
    }

    /**
     * get current cell
     * 
     * @returns the value of the current cell
     * 
     * */
    getCurrentCell(): Cell {
        return this.cells[this.currentColumn][this.currentRow];
    }

    /**
     * get cell by label
     * 
     * a label is a string where 
     * the first characters are the column in base 26 
     * and the last characters are the row in base 10
     * 
     * 
     * @param label
     * 
     */

    getCellByLabel(label: string): Cell {
        const [column, row] = Cell.cellToColumnRow(label);

        return this.cells[column][row];
    }

    /**
     * set cell by label
     * 
     * @param label the coordinates of the cell
     * @param cell the cell to set
     */
    setCellByLabel(label: string, cell: Cell): void {
        const [column, row] = Cell.cellToColumnRow(label);
        this.cells[column][row] = cell;
    }

    /**
     * set current cell formula
     *  
     * @param formula
     *  
     * */
    setCurrentCellFormula(formula: FormulaType): void {
        this.cells[this.currentColumn][this.currentRow].setFormula(formula);
    }

    /**
     * 
     * get current cell formula
     * 
     * @returns the formula of the current cell
     * 
     */
    getCurrentCellFormula(): FormulaType {
        return this.cells[this.currentColumn][this.currentRow].getFormula()
    }

    /**
     * set current cell value
     *  
     * @param value
     *  
     * */
    setCurrentCellValue(value: number): void {
        let workingCell: Cell = this.cells[this.currentColumn][this.currentRow];
        workingCell.setValue(value);
    }

    /**
     * Get Sheet formulas
     * 
     * returns a twoD array of formulas
     * 
     * */
    getSheetFormulas(): FormulaType[][] {
        let formulas: FormulaType[][] = [];
        for (let column = 0; column < this.maxColumns; column++) {
            formulas[column] = [];
            for (let row = 0; row < this.maxRows; row++) {
                formulas[column][row] = this.cells[column][row].getFormula();
            }
        }
        return formulas;
    }

    /**
     * 
     * set sheet formulas
     * 
     * @param formulas
     * 
     */
    setSheetFormulas(formulas: FormulaType[][]): void {
        for (let column = 0; column < this.maxColumns; column++) {
            for (let row = 0; row < this.maxRows; row++) {
                let cell = new Cell();
                cell.setFormula(formulas[column][row]);
                this.cells[column][row] = cell;
            }
        }


    }

    /**
     * Get Sheet display strings
     * 
     * returns a twoD array of display strings
     */
    getSheetDisplayStrings(): string[][] {
        let displayStrings: string[][] = [];
        for (let column = 0; column < this.maxColumns; column++) {
            displayStrings[column] = [];
            for (let row = 0; row < this.maxRows; row++) {
                const displayString = this.cells[column][row].getDisplayString();

                displayStrings[column][row] = displayString;


            }
        }
        return displayStrings;
    }


}


export default SheetMemory;