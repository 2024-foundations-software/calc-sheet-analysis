import React from "react";  

import Cell from "../Engine/Cell";

import "./SheetComponent.css";

// a component that will render a two dimensional array of cells
// the cells will be rendered in a table
// the cells will be rendered in rows
// a click handler will be passed in

interface SheetComponentProps {
  cellsValues: Array<Array<string>>;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  currentCell: string;
} // interface SheetComponentProps


function SheetComponent({ cellsValues, onClick, currentCell }: SheetComponentProps) {
  return (
    <table className="table">
      <tbody>
        {/*add a row with column cellsValues */}
        <tr>
          <th></th>
          {cellsValues.map((col, colIndex) => (
            <th key={colIndex}>
              {Cell.columnNumberToName(colIndex)}
            </th>
          ))}
        </tr>
        {cellsValues.map((row, rowIndex) => (
          
          <tr key={rowIndex}>
           <td> {Cell.rowNumberToName(rowIndex)}</td>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <button

                  onClick={onClick}
                  value={cell}
                  cell-label={Cell.columnRowToCell(rowIndex, colIndex)}
                  className={(currentCell === Cell.columnRowToCell(rowIndex, colIndex)) ? "cell-selected" : "cell"}
                 
                >
                  {cell}
                </button>
                
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
} // SheetComponent




export default SheetComponent;