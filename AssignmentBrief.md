### Welcome to your job at ACME Software

<img align="right" src="./media/acme.jpeg" width="400px" alt="picture"> 

Welcome to ACME software.  We are happy to have you on board here at our start up.  

#### Onboarding

Your first assignment (should you choose to accept it) is to pick up a project that Bilbo Baggins was working on when he left the company.   He said he had some sort of important quest or something.  

Anyhow.  What was Bilbo Baggins working on?

### The demonstratable Spreadsheet.

We are building a spreadsheet that will be used by teachers in primary school and early high school to explain how a spreadhsheet works with a simple interface.   This will be the focus of your employment here at ACME Software.

#### The problem we have.

Bilbo was well on his way to getting the work done however he ended up with some code that kinda works.


Bilbo did a couple of things on his way out.   He deleted the core calculator in `FormulaEvaluator.ts`  

He was also required to provide a message when the user was not logged in to the main page.  

He did do us a favor and he left us the unit tests for `FormulaEvaluator.ts` You can find these unit tests in `FormulaEvaluator.test.ts`.  But we are not completely sure that he did not add something there to confuse the people who are replacing him.






FormulaBuilder (Model)	The FormulaBuilder class is implemented and all unit test pass.   The FormulaBuilder.ts file is well documented.	

5 points


FormulaEvaluator (Model)	FormulaEvaluator is implemented and all unit tests pass	5 points
Calculator. (Controller)	Calculator is implemented and all unit tests pass	5 points
App.tsx (View) (plus KeyPad.tsx	The react calculator works, The buttons have style (not ugly like professor sample)	5 points
App.tests.tsx (view)	All compontents in the calculator have data-testid that can be used in Jest tests.	5 points







Here is a (not pretty) version of the calculator 



















The calculator view has three elements  

The current formula. (You usually don't see this on a calculator)
the value of the evaluation of the formula (if the formula is valid) or an error message
The KeyPad with the buttons that you press to use the calculator
Learning Objectives

Building your own calculator is interesting, however the goals of this assignment are to introduce you to two technologies and show how testing can be done for these components.   There are numerous tutorials on the web that explain how to build a react application.  It is the expectation of this assignment that at the end of this you have successfully learned some of the following technologies.

Typescript (The model of the calculator, and the Controller)
React (The View)
Jest for typescript
Jest for UI testing


A detailed explanation of how we will build the calculator can be found here




The calculator that you build will be built using the Model View Controller pattern.

The model (where the data is stored) will be implemented in two classes, FormulaBuilder and FormulaEvaluator.  

The controller (the connection between the data and the view) will be a class called Calculator which will accept input from the view, and will present information to the view.

The View will be built in react where each button in the KeyPad will result in a message being sent to the controller.




The Model
A formula, and a formula evaluator:




FormulaBuilder

This will be a typescript class that will accept single character inputs and will build an array of strings that correspond to the arithmetic expression the user wants to evaluate.  




The specifications for this class are as follows

/** 
 * @path /src/FormulaBuilder.ts
 * 
 * FormulaBuilder is a class that builds an array of tokens.  Each token is a string
 * 
 * A token is either a number, an operator, or parenthesis
 * 
 * This class will provide a getter for the formula
 * This class will provide a function to clear the formula
 * 
 * This class will provide a function to add a character to the formula addCharacter(character: string)
 * 
 * If the formula is empty then the character becomes the first token
 * If the last token is a number then the character is appended to the number
 * if the last token is a number that does not contain a decimal and the input is a decimal then the decimal is appended to the number
 * If the last token is an operator then the character becomes the next token
 * If the last token is a left parenthesis then the character becomes the next token
 * If the last token is a right parenthesis then the character becomes the next token
 * 
 * This class will provide a function to remove the last character from the formula removeCharacter()
 * if the formula is empty then nothing happens
 * if the last token is a number whose string representation is only one character long then the number is removed
 * if the last token is a number whose string representation is longer than one character then the last character is removed from the number
 * if the last token is an operator then the operator is removed
 * if the last token is a left parenthesis then the left parenthesis is removed
 * if the last token is a right parenthesis then the right parenthesis is removed
 * */




You can use these tests to make sure that the FormulaBuilder you build is correct.

import { FormulaBuilder } from '../src/FormulaBuilder';

describe('FormulaBuilder', () => {
    let formulaBuilder: FormulaBuilder;

    beforeEach(() => {
        formulaBuilder = new FormulaBuilder();
    });

    describe('addCharacter', () => {
        it('should add the first token if the formula is empty', () => {
            formulaBuilder.addCharacter('1');
            expect(formulaBuilder.formula).toEqual(['1']);
        });

        it('should append the character to the last token if the last token is a number', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter('2');
            expect(formulaBuilder.formula).toEqual(['12']);
        });

        it('should append the decimal to the last token if the last token is a number without a decimal', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter('.');
            expect(formulaBuilder.formula).toEqual(['1.']);
        });

        it('should add the character as a new token if the last token is an operator', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter('+');
            expect(formulaBuilder.formula).toEqual(['1', '+']);
        });

        it('should add the character as a new token if the last token is a left parenthesis', () => {
            formulaBuilder.addCharacter('(');
            formulaBuilder.addCharacter('1');
            expect(formulaBuilder.formula).toEqual(['(', '1']);
        });

        it('should add the character as a new token if the last token is a right parenthesis', () => {
            formulaBuilder.addCharacter(')');
            formulaBuilder.addCharacter('+');
            expect(formulaBuilder.formula).toEqual([')', '+']);
        });
    });

    describe('removeCharacter', () => {
        it('should do nothing if the formula is empty', () => {
            formulaBuilder.removeCharacter();
            expect(formulaBuilder.formula).toEqual([]);
        });

        it('should remove the last character from a number token if the number has more than one character', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter('2');
            formulaBuilder.removeCharacter();
            expect(formulaBuilder.formula).toEqual(['1']);
        });

        it('should remove the number token if the number has only one character', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.removeCharacter();
            expect(formulaBuilder.formula).toEqual([]);
        });

        it('should remove the operator token if the last token is an operator', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter('+');
            formulaBuilder.removeCharacter();
            expect(formulaBuilder.formula).toEqual(['1']);
        });

        it('should remove the left parenthesis token if the last token is a left parenthesis', () => {
            formulaBuilder.addCharacter('(');
            formulaBuilder.removeCharacter();
            expect(formulaBuilder.formula).toEqual([]);
        });

        it('should remove the right parenthesis token if the last token is a right parenthesis', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter(')');
            formulaBuilder.removeCharacter();
            expect(formulaBuilder.formula).toEqual(['1']);
        });
    });

    describe('clearFormula', () => {
        it('should clear the formula', () => {
            formulaBuilder.addCharacter('1');
            formulaBuilder.addCharacter('+');
            formulaBuilder.clearFormula();
            expect(formulaBuilder.formula).toEqual([]);
        });
    });
});

A recursive descent FormulaEvaluator (parser), we will introduce the recursive descent parser in the class of July 6.  in addition to introducing the jest unit test framework.

 /**
 * This class evaluates a formula represented as an array of strings.
 * 
 * The formula is evaluated using the following rules:
 * 1. The formula is evaluated from left to right
 * 2. The formula is evaluated using the order of operations
 * 3. The formula is evaluated using the following operators:
 *   +, -, *, /, (, )
 * 4. The formula is evaluated using the following rules of precedence:
 *  1. Parentheses
 * 2. Multiplication and division
 * 3. Addition and subtraction
 * 
 * The formula is evaluated using a recursive descent parser. that implements the following grammar:
 * 
 * The constructor does not take any inputs.
 * The evaluate method takes a list of strings that represent a formula.
 * 
 * expression = term { ( '+' | '-' ) term }
 * term = factor { ( '*' | '/' ) factor }
 * factor = number | '(' expression ')'
 * number = is a string that can be converted to a number
 * 
 * The formula is represented as an array of strings. Each string is either a number or an operator.
 * 
 * The result of the evaluation is stored in the result property.
 * 
 * If there is an error evaluating the formula then the error property is set to an error message, and the result property is set to 0.
 */

Here are a set of jest tests that you can validate your implementation against.

export { };

import FormulaEvaluator from '../src/FormulaEvaluator';
let formulaEvaluator: FormulaEvaluator;


describe('formulaEvaluator', () => {

    it('should return the correct result for a simple formula', () => {

        const formula = ['2', '+', '3'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(5);
        expect(error).toEqual('');
    });

    it('should add up three numbers, 1,2,3', () => {
        let formulaEvaluator = new FormulaEvaluator(['1', '+', '2', '+', '3']);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(6);
        expect(error).toEqual('');
    });


    it('should multiply three numbers, 1,2,3', () => {
        let formulaEvaluator = new FormulaEvaluator(['1', '*', '2', '*', '3']);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(6);
        expect(error).toEqual('');
    });

    it('should return the correct result for a formula with multiple operators', () => {
        const formula = ['2', '+', '3', '*', '4'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(14);
        expect(error).toEqual('');
    });

    it('should return 1 when the formula is (1)', () => {
        const formula = ['(', '1', ')'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(1);
        expect(error).toEqual('');
    });

    it('should return 3 when the formula is (1+2)', () => {
        const formula = ['(', '1', '+', '2', ')'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(3);
        expect(error).toEqual('');
    });

    it('should return 6 when the formula is (1+2)*2', () => {
        const formula = ['(', '1', '+', '2', ')', '*', '2'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(6);
        expect(error).toEqual('');
    });

    it('should return the correct result for a formula with parentheses', () => {
        const formula = ['(', '2', '+', '3', ')', '*', '4'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(20);
        expect(error).toEqual('');
    });

    it('should return an error message for a formula with a syntax error', () => {
        const formula = ['2', '+', '3', '*'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(0);
        expect(error).toEqual('Syntax error');
    });

    it('should return an error message for a formula with a division by zero', () => {
        const formula = ['2', '/', '0'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(0);
        expect(error).toEqual('Division by zero');
    });

    it('should return an error message for a formula with an empty expression', () => {
        const formula: string[] = [];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(0);
        expect(error).toEqual('Empty formula');
    });

    it('should return an error message for a formula with an invalid number', () => {
        const formula = ['2', '+', '3', '*', 'a'];
        let formulaEvaluator = new FormulaEvaluator(formula);
        formulaEvaluator.evaluate();
        const result = formulaEvaluator.result;
        const error = formulaEvaluator.error;
        expect(result).toEqual(0);
        expect(error).toEqual('Syntax error');
    });


});




The Controller

A class called Calculator

/**
 * Calculator class
 * @class Calculator
 * @export Calculator
 * 
 * The Calculator class is a container for a formula and a result.  
 * 
 * It uses a FormulaBuilder to build a formula
 * It uses a FormulaEvaluator to evaluate a formula
 * 
 * the Calculator class exposes a addCharacter that calls formulaBuilder.addCharacter
 * The Calculator class exposes a removeCharacter method that calls formulaBuilder.removeCharacter
 * It uses a FormulaBuilder to build a formula
 * It uses a FormulaEvaluator to evaluate a formula
 * 
 * it exposes two properties: formulaString and resultString
 * if the formula is empty then the resultString is empty
 * if the formula evaluation results in an error then the resultString is set to the error message
 * 
 * 
 * it exposes a clear method that calls formulaBuilder.clearFormula, this results in the formulaString and resultString being empty
 * 
 * 
 */


Some unit tests for your Calculator (these are here just to help.  the main testing is done against the FormulaBuilder and the FormulaEvaluator.




import Calculator from './Calculator';

describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('addCharacter', () => {

        it('should handle multiple characters', () => {
            calculator.addCharacter('1');
            calculator.addCharacter('1');
            calculator.addCharacter('1');
            expect(calculator.formulaString).toEqual('111');
            expect(calculator.resultString).toEqual('111');
        });
    });

    describe('clear', () => {
        it('should clear the formula and result string', () => {
            calculator.addCharacter('1');
            calculator.clear();
            expect(calculator.formulaString).toEqual('');
            expect(calculator.resultString).toEqual('');
        });
    });

    describe('resultString', () => {
        it('should be empty when the formula is empty', () => {
            expect(calculator.resultString).toEqual('');
        });

        it('should be the result of the formula when it can be evaluated', () => {
            calculator.addCharacter('1');
            calculator.addCharacter('+');
            calculator.addCharacter('2');
            expect(calculator.resultString).toEqual('3');
        });

        it('should be an error message when the formula cannot be evaluated', () => {
            calculator.addCharacter('1');
            calculator.addCharacter('/');
            calculator.addCharacter('0');
            expect(calculator.resultString).toEqual('Division by zero');
        });
    });

});
The view

The react setup you will run (see below) defines a file called App.tsx.  You can keep this as it is.   You should define an additional component called KeyPad.tsx.  The definition of this is.

/**
 * @jest-environment jsdom
 * 
 * A component that renders a keypad.
 * 
 * The key pad will have the following rows of keys
 * ( ) AC C
 * 7 8 9 /
 * 4 5 6 *
 * 1 2 3 -
 * 0 . = +
 * 
 */

The KeyPad.tsx component will accept one property (prop in react lingo) that is the call back function that will be called when you click on a button.  This call back function should be added to every button.  basically you will define the props for your KeyPad component as follows




// Define the props for KeyPad the props are the functions that the buttons will call
interface KeyPadProps {
    handleButtonPress: (button: string) => void;
}






In your App.tsx you will import Calculator and instantiate it.  you will then use two useState react hooks. (Check out the link) to update the formulaString and the resultString.  Once we are done with our in class exercises you will be familiar to do this.   I have provided you with a very simple sample of how to do this.   The sample i provided you has no style attached to the buttons of the formula or the result.  You will need to read up on how to use css styles to make your calculator look better than the one i gave you.

Additionally you will implement a function in your App.tsx file that will be called by the button presses.   In my implementation i called it handleButtonEvent




  /**
   * 
   * function that the buttons in Keypad will call
   * 
   */
  function handleButtonPress(button: string) {
   // based on the key pressed in the keypad call your 
   // instance of your calculator as needed.   
   // C = remove character
   // AC = Clear formula
   // = does nothing, its just prettier with that key there
   // all other buttons addCharacter

  }
How to get going




 npx create-react-app my-calculator --template typescript 




in your root directory add a file called with the following content in it.  Do this so you can run the tests to make sure your code is working.

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.mjs$": "babel-jest", // Add this line to support ECMAScript modules
    },
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy'
    }

};
React Jest Testing

With the testing that we have seen for the controller and the model we can see how to define the tests.   

Inputs -> expected outputs.

When we are building a UI the inputs are user actions and we cannot afford to use humans for all of our testing.  Hence we use JEST to build a HTML document and trigger events within that document then we test the updated html document to see if the action resulted in the correct effect.  There are a number of ways that this can be done.  In this course we are using the jsdom environment.




You will need to set up your react test files so they work correctly.

Naming your react test file

your react test file follows the same pattern as the typescript files.  In this assignment you will see that there is an App.test.tsx file that starts with these lines.




import React from 'react'
import { render, screen } from '@testing-library/react';
import App from './App';


 




This assumes that all of the testing we are doing is going to use web based testing.  We are testing regular Typescript and react components thus we need to adjust our project to account for this.

/**
 * @jest-environment jsdom  
 *                          This line above tells jest that this is a web file
 */
import React from 'react';


import { render, fireEvent, screen } from '@testing-library/react'; // we will need fireEvent

import "@testing-library/jest-dom/extend-expect"; // add this
import App from './App';





Now you are ready to test with jest, and here is the unit test file for the calculator

);
    const clear_all_button = getByTestId("ac-button");
    fireEvent.click(clear_all_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be ""
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("");
    expect(formulaString).toBe("");
    // now click the 1 button and expect the result string to be "1"
    const one_button = getByTestId("one-button");
    fireEvent.click(one_button);

    resultString = resultElement.textContent;
    formulaString = formulaElement.textContent;

    expect(resultString).toBe("1");
    expect(formulaString).toBe("1");

    // now do all clear again
    fireEvent.click(clear_all_button);

    resultString = resultElement.textContent;
    formulaString = formulaElement.textContent;

    expect(resultString).toBe("");
    expect(formulaString).toBe("");
  });

  it("c should clear the last entry for single digit number", () => {
    const { getByTestId } = render();
    const clear_button = getByTestId("c-button");
    const one_button = getByTestId("one-button");

    fireEvent.click(one_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "1"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("1");
    expect(formulaString).toBe("1");

    // now click the c button and expect the result string to be ""
    fireEvent.click(clear_button);

    resultString = resultElement.textContent;
    formulaString = formulaElement.textContent;

    expect(resultString).toBe("");
    expect(formulaString).toBe("");
  });

  it("c should clear the last character for multiple digit number", () => {
    const { getByTestId } = render();
    const clear_button = getByTestId("c-button");
    const one_button = getByTestId("one-button");
    const two_button = getByTestId("two-button");

    fireEvent.click(one_button);
    fireEvent.click(two_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "12"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("12");
    expect(formulaString).toBe("12");

    // now click the c button and expect the result string to be "1"
    fireEvent.click(clear_button);

    resultString = resultElement.textContent;
    formulaString = formulaElement.textContent;

    expect(resultString).toBe("1");
    expect(formulaString).toBe("1");
  });

  it("should remove the + from 1 + when the clear button is pressed", () => {
    const { getByTestId } = render();
    const clear_button = getByTestId("c-button");
    const one_button = getByTestId("one-button");
    const add_button = getByTestId("add-button");

    fireEvent.click(one_button);
    fireEvent.click(add_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "Syntax error"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("Syntax error");
    expect(formulaString).toBe("1 +");

    // now click the c button and expect the result string to be "1"
    fireEvent.click(clear_button);

    resultString = resultElement.textContent;
    formulaString = formulaElement.textContent;

    expect(resultString).toBe("1");
    expect(formulaString).toBe("1");
  });



  it("should display the result string", () => {
    const { getByTestId } = render();
    const one_button = getByTestId("one-button");
    fireEvent.click(one_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");
    // get the text of the result string
    // expect the text to be "1"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("1");
    expect(formulaString).toBe("1");

    // click the "2" button
    const two_button = getByTestId("two-button");
    fireEvent.click(two_button);

    // get the text of the result string
    // expect the text to be "12"
    resultString = resultElement.textContent;
    formulaString = formulaElement.textContent;
    expect(resultString).toBe("12");
    expect(formulaString).toBe("12");
  });

  it("should display display the formula + and Syntax error for the result", () => {
    const { getByTestId } = render();

    const add_button = getByTestId("add-button");
    fireEvent.click(add_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "Syntax Error"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;
    expect(resultString).toBe("Syntax error");
    expect(formulaString).toBe("+");

  });

  it("should display the formula string and result string for 44 + 2", () => {
    const { getByTestId } = render();
    expect(getByTestId("formula-string").textContent).toBe("");

    const four_button = getByTestId("four-button");
    fireEvent.click(four_button);
    fireEvent.click(four_button);

    const add_button = getByTestId("add-button");
    fireEvent.click(add_button);

    const two_button = getByTestId("two-button");
    fireEvent.click(two_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "46"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;
    expect(resultString).toBe("46");
    expect(formulaString).toBe("44 + 2");
  });

  it("should result in a division by zero error", () => {
    const { getByTestId } = render();
    const clear_button = getByTestId("c-button");
    const one_button = getByTestId("one-button");
    const divide_button = getByTestId("divide-button");
    const zero_button = getByTestId("zero-button");
    const equals_button = getByTestId("equals-button");

    fireEvent.click(one_button);
    fireEvent.click(divide_button);
    fireEvent.click(zero_button);
    fireEvent.click(equals_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "Division by zero error"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("Division by zero");
    expect(formulaString).toBe("1 / 0");
  });

  it("should evaluate ( 22 + 8 ) / 10 correctly", () => {
    const { getByTestId } = render();
    const left_parenthesis_button = getByTestId("left-parenthesis-button");
    const two_button = getByTestId("two-button");
    const add_button = getByTestId("add-button");
    const eight_button = getByTestId("eight-button");
    const right_parenthesis_button = getByTestId("right-parenthesis-button");
    const divide_button = getByTestId("divide-button");
    const ten_button = getByTestId("ten-button");
    const equals_button = getByTestId("equals-button");

    fireEvent.click(left_parenthesis_button);
    fireEvent.click(two_button);
    fireEvent.click(two_button);
    fireEvent.click(add_button);
    fireEvent.click(eight_button);
    fireEvent.click(right_parenthesis_button);
    fireEvent.click(divide_button);
    fireEvent.click(ten_button);
    fireEvent.click(equals_button);

    const resultElement = getByTestId("result-string");
    const formulaElement = getByTestId("formula-string");

    // get the text of the result string
    // expect the text to be "3"
    let resultString = resultElement.textContent;
    let formulaString = formulaElement.textContent;

    expect(resultString).toBe("3");
    expect(formulaString).toBe("( 22 + 8 ) / 10");
  });

});


There you have it.  A test driven specification for your calculator.




Getting up and running

hw1-5500-summer-2023.zip




unzip the file then cd into the directory and use npm (node package manager) to install all the dependencies.




cd hw1-5500-summer-2023
npm install

The npm command will install all the node libraries that are being used in this assignment.

once you have done this, you can run the command 

npm run start 

If you have done this correctly it will start a web service and will open a new tab in your browser so you can see my ugly calculator.


