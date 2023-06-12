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
        {cellsValues.map((col, colIndex) => (
          <tr key={colIndex}>
            {col.map((cell, rowIndex) => (
              <td key={rowIndex}>
                <button

                  onClick={onClick}
                  value={cell}
                  cell-label={Cell.columnRowToCell(colIndex, rowIndex)}
                  className={(currentCell === Cell.columnRowToCell(colIndex, rowIndex)) ? "cell-selected" : "cell"}
                 
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