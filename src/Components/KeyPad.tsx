import React from "react";
import { ButtonNames } from "../Engine/GlobalDefinitions";

import Button from "./Button";

import "./KeyPad.css";
import "./Button.css";

interface KeyPadProps {
  onButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCommandButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
} // interface KeyPadProps

function KeyPad({ onButtonClick, onCommandButtonClick }: KeyPadProps) {

  // the buttons use one of three classes
  // numberButton, operatorButton, and otherButton
  return (
    <div className="buttons">
      <div className="buttons-row">
        <Button
          text="7"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="seven-button"
        />
        <Button
          text="8"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="eight-button"
        />
        <Button
          text="9"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="nine-button"
        />
        <Button
          text={ButtonNames.allClear}
          isDigit={true}
          onClick={onCommandButtonClick}
          className="button-operator"
          dataTestId="all-clear-button"
        />
        <Button
          text={ButtonNames.clear}
          isDigit={false}
          onClick={onCommandButtonClick}
          className="button-operator"
          dataTestId="clear-button"
        />
      </div>

      <div className="buttons-row">
        <Button
          text="4"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="four-button"
        />
        <Button
          text="5"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="five-button"
        />
        <Button
          text="6"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="six-button"
        />
        <Button
          text="*"
          isDigit={false}
          onClick={onButtonClick}
          className="button-operator"
          dataTestId="multiply-button"
        />
        <Button
          text="/"
          isDigit={false}
          onClick={onButtonClick}
          className="button-operator"
          dataTestId="divide-button"
        />
      </div>

      <div className="buttons-row">
        <Button
          text="1"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="one-button"
        />
        <Button
          text="2"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="two-button"
        />
        <Button
          text="3"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="three-button"
        />
        <Button
          text="+"
          isDigit={false}
          onClick={onButtonClick}
          className="button-operator"
          dataTestId="add-button"
        />
        <Button
          text="-"
          isDigit={false}
          onClick={onButtonClick}
          className="button-operator"
          dataTestId="subtract-button"
        />

      </div>

      <div className="buttons-row">
        <Button
          text="0"
          isDigit={true}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="zero-button"
        />
        <Button
          text="."
          isDigit={false}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="decimal-button"
        />
        <Button
          text="("
          isDigit={false}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="left-parenthesis-button"
        />
        <Button
          text=")"
          isDigit={false}
          onClick={onButtonClick}
          className="button-number"
          dataTestId="right-parenthesis-button"
        />
        <Button
          text={ButtonNames.done}
          isDigit={true}
          onClick={onCommandButtonClick}
          className="button-operator"
          dataTestId="done-button"
        />
      </div>

    </div>
  );
} // KeyPad

export default KeyPad;
