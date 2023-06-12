import React from "react";

import Button from "./Button";

import "./KeyPad.css";
import "./Button.css";

interface KeyPadProps {
  onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCommandButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
} // interface KeyPadProps

function KeyPad ({ onButtonClick, onCommandButtonClick }: KeyPadProps) {

// the buttons use one of three classes
// numberButton, operatorButton, and otherButton
return (
  <div className="buttons">


    <div className="buttons-row">

      <Button text="edit" isDigit={true}  onClick={onCommandButtonClick} className="button-operator" />
      <Button text="+/-" isDigit={true}  onClick={onCommandButtonClick} className="button-operator" />
      <Button text="C" isDigit={true}  onClick={onCommandButtonClick} className="button-operator" />
      <Button text="AC" isDigit={false} onClick={onCommandButtonClick} className="button-operator" />
    </div> 
    <div className="buttons-row">

      <Button text="1" isDigit={true}  onClick={onButtonClick} className="button-number" />
      <Button text="2" isDigit={true}  onClick={onButtonClick} className="button-number" />
      <Button text="3" isDigit={true}  onClick={onButtonClick} className="button-number" />
      <Button text="+" isDigit={false} onClick={onButtonClick} className="button-operator" />
    </div>

    <div className="buttons-row">
      <Button text="4" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="5" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="6" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="-" isDigit={false} onClick={onButtonClick} className="button-operator"/>
    </div>

    <div className="buttons-row">
      <Button text="7" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="8" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="9" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="*" isDigit={false} onClick={onButtonClick} className="button-operator"/>
    </div>

    <div className="buttons-row">
      <Button text="0" isDigit={true}  onClick={onButtonClick} className="button-number"/>
      <Button text="." isDigit={false} onClick={onButtonClick} className="button-number"/>
      <Button text="=" isDigit={false} onClick={onCommandButtonClick} className="button-equal"/>
      <Button text="/" isDigit={false} onClick={onButtonClick} className="button-operator"/>
    </div>
      
  </div>
  );
  } // KeyPad

  export default KeyPad;
