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
} // interface SheetComponentProps


function SheetComponent({ cellsValues, onClick }: SheetComponentProps) {
  return (
    <table className="table">
      <tbody>
        {cellsValues.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <button
                  className="cell"
                  onClick={onClick}
                  value={cell}
                  cell-label={Cell.columnRowToCell(rowIndex, colIndex)}
                 
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