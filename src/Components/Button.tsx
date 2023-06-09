import React from "react";
import "./Button.css";

interface ButtonProps {
  text: string;
  isDigit: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
} // interface ButtonProps

const Button: React.FC<ButtonProps> = ({ text, isDigit,  onClick,className }) => {
  return (
    <button className={className}
            onClick={onClick}
            data-is-digit={isDigit}>
              
      {text}
    </button>
  );
}

export default Button;