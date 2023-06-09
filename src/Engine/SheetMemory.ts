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

import Recalc from "./Recalc";
import Cell from "./Cell";

export class SheetMemory
{
    private cells: Cell[][];
    private maxRows = 8;
    private maxColumns = 8;

    private currentRow = 0;
    private currentColumn = 0;

    private recalc: Recalc = new Recalc();

    constructor(columns: number, rows: number)
    {
        
        this.maxColumns = columns;
        this.maxRows = rows;

        this.cells = [];
        for (let column = 0; column < this.maxColumns; column++)
        {
            this.cells[column] = [];
            for (let row = 0; row < this.maxRows; row++)
            {
                this.cells[column][row] = new Cell();
            }
        }
    }

    /**
     * getter for max rows
     * 
     * @returns the max rows
     *  
     * */
    getMaxRows(): number
    {
        return this.maxRows;
    }

    /**
    * getter for max columns
    *   
    * @returns the max columns
    * 
    * */
    getMaxColumns(): number
    {
        return this.maxColumns; 
    }


    /**
     *  get the cell coordinates currently being worked on
     * 
     * returns an array of [row, column]
     * */
    getCurrentCellCoordinates(): number[]
    {
        return [this.currentColumn, this.currentRow];
    }

    /**
     * set the cell at the given row and column
     * 
     * @param row
     * @param column
     * @param cell
     * */
    setCurrentCellCoordinates(column: number, row:number): void
    {
        this.currentRow = row;
        this.currentColumn = column;
    }

    /**
     * set the current cell
     * 
     * @param cell
     */
    setCurrentCell(cell: Cell): void
    {
        this.cells[this.currentColumn][this.currentRow] = cell;
    }

    /**
     * get current cell
     * 
     * @returns the value of the current cell
     * 
     * */
    getCurrentCell(): Cell
    {
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
    
    getCellByLabel(label: string): Cell
    {
        const [column, row] = Cell.cellToColumnRow(label);
       // console.log("getCellByLabel: " + label);
       // console.log("getCellByLabel: (" +label+ ") depends on [" + this.cells[column][row].getDependsOn() + "]");
        return this.cells[column][row];
    }

    /**
     * set cell by label
     * 
     * @param label the coordinates of the cell
     * @param cell the cell to set
     */
    setCellByLabel(label: string, cell: Cell): void
    {
        const [column, row] = Cell.cellToColumnRow(label);
        this.cells[column][row] = cell;
    }

    /**
     * get cell by coordinates
     * 
     * @param column
     * @param row

     *  
     * */
    getCellByCoordinates(column:number, row:number): Cell
    {
        return this.cells[column][row];
    }

    /**
     * set cell by coordinates
     * 
     * @param row
     * @param column
     * @param cell the cell to set
     * 
     */
    setCellByCoordinates( column: number, row: number, cell: Cell): void
    {
        this.cells[column][row] = cell;
    }


    /**
     * set current cell formula
     *  
     * @param formula
     *  
     * */
    setCurrentCellFormula(formula: FormulaType): void
    {
        this.cells[this.currentColumn][this.currentRow].setFormula(formula);
    }

    /**
     * 
     * get current cell formula
     * 
     * @returns the formula of the current cell
     * 
     */
    getCurrentCellFormula(): FormulaType
    {
        return this.cells[this.currentColumn][this.currentRow].getFormula()
    }

    /**
     * set current cell display string
     * 
     * @param displayString
     * 
     * */
    setCurrentCellDisplayString(displayString: string): void
    {
        this.cells[this.currentColumn][this.currentRow].setDisplayString(displayString);
    }
    /**
     * get current cell display string
     * 
     * @returns the display string of the current cell
     * 
     * */
    getCurrentCellDisplayString(): string
    {
        return this.cells[this.currentColumn][this.currentRow].getDisplayString();
    }

    /**
     * set current cell value
     *  
     * @param value
     *  
     * */
    setCurrentCellValue(value: number): void
    {
        let workingCell: Cell = this.cells[this.currentColumn][this.currentRow];
        workingCell.setValue(value);
    }

    /**
     * get current cell value
     *  
     * @returns the value of the current cell
     *  
     * */
    getCurrentCellValue(): number
    {
        const cell:Cell = this.cells[this.currentColumn][this.currentRow];
        return cell.getValue();
    }

    
    /**
     * Get Sheet formulas
     * 
     * returns a twoD array of formulas
     * 
     * */
    getSheetFormulas(): FormulaType[][]
    {
        let formulas: FormulaType[][] = [];
        for (let column = 0; column < this.maxColumns; column++)
        {
            formulas[column] = [];
            for (let row = 0; row < this.maxRows; row++)
            {
                formulas[column][row] = this.cells[column][row].getFormula();
            }
        }
        return formulas;
    }

    /**
     * Get Sheet values
     * 
     * returns a twoD array of values
     * 
     * */
    getSheetValues(): number[][]
    {
        let values: number[][] = [];
        for (let column = 0; column < this.maxColumns; column++)
        {
            values[column] = [];
            for (let row = 0; row < this.maxRows; row++)
            {
                values[column][row] = this.cells[column][row].getValue();
            }
        }
        return values;
    }

    /**
     * Get Sheet display strings
     * 
     * returns a twoD array of display strings
     */
    getSheetDisplayStrings(): string[][]
    {
        let displayStrings: string[][] = [];
        for (let column = 0; column < this.maxColumns; column++)
        {
            displayStrings[column] = [];
            for (let row = 0; row < this.maxRows; row++)
            {
                displayStrings[column][row] = this.cells[column][row].getDisplayString();
            }
        }
        return displayStrings;
    }
    

    /**
     * Get Sheet Dependencies
     * 
     * returns a twoD array of dependencies
     * 
     * */
    getDependsOn(): string[][][]
    {
        let dependencies: string[][][] = [];
        for (let column = 0; column < this.maxColumns; column++)
        {
            dependencies[column] = [];
            for (let row = 0; row < this.maxRows; row++)
            {
                dependencies[column][row] = this.cells[column][row].getDependsOn();
            }
        }

        return dependencies;
    }
    


    /**
     * Evaluate the formula for the current cell.
     * 
     * @returns the value of the current cell
     * 
     */
    evaluateCurrentCell(): number
    {
        const formula = this.getCurrentCell().getFormula()
        const value = this.evaluateFormulaNumber(formula);
        this.setCurrentCellValue(value);
        return value;

    }

    /**
     * Evaluate the formula 
     * 
     * @param formula
     * 
     * @returns the value of the formula
     * 
     * */
    evaluateFormulaNumber(formula: FormulaType): number
    {
        const [value, displayString] = this.recalc.evaluate(formula, this);
        const result = parseFloat(displayString);
        return result
    }




  }

  export default SheetMemory;