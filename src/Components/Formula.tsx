import React, { useEffect, useState } from "react";

import "./Formula.css";



// FormulaComponentProps
// we pass in value for the formula 
// and the value for the current result
type FormulaProps = {
  formulaString: string;
  resultString: string;
} // interface FormulaProps




const Formula: React.FC<FormulaProps> = ({ formulaString, resultString}) => {
  return (
    <div>
      "Formula"<br></br>
      <div className="formula">
        {formulaString} 
      </div> <br></br>
      "Result"<br></br>
      <div className="formula">
        {resultString} 
      </div>
    </div>
    
  );
} // const Formula 

export default Formula; 