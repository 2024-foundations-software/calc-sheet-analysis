import Machine from "../../Engine/Machine";

import { ErrorMessages } from "../../Engine/GlobalDefinitions";

/**
 * The main object of the SpreadSheet
 * 
 * The exported methods are
 * 
 * addToken(token:string):  void
 *   This relies on the TokenProcessor class
 * 
 * getFormulaString(void): string
 *   This relies on the TokenProcessor class
 * 
 * getResultString(void): string
 *    This relies on the Recalc class
 * 
 * 
 */

describe("Machine", () => {
  describe("addToken", () => {
  
    describe("when the formula is empty", () => {
      it("should add the token to the formula", () => {
        const machine = new Machine(5,5);
        machine.addToken("1");

        expect(machine.getFormulaString()).toEqual("1");
        expect(machine.getResultString()).toEqual("1");
      });
    });

    describe("when the formula is not empty", () => {
      it("should add the token to the formula", () => {
        const machine = new Machine(5,5);
        machine.addToken("1");
        machine.addToken("+");
        machine.addToken("2");
        expect(machine.getFormulaString()).toEqual("1 + 2");
        expect(machine.getResultString()).toEqual("3");
      });
    }); 

    
    describe("when the currentCellCoordinates change", () => {
      describe("And you then change the coordinates back", () => {
        it("should result in the same formula being in the tokenProcessor", () => {
          const machine = new Machine(5,5);
          machine.setCurrentCellByLabel("B1");
          machine.addToken("1");
          machine.addToken("+");
          machine.addToken("2");

          machine.setCurrentCellByLabel("A1");
          machine.addToken("1");
          machine.addToken("2");
          machine.setCurrentCellByLabel("B1");

          expect(machine.getFormulaString()).toEqual("1 + 2");

          machine.setCurrentCellByLabel("A1");
          expect(machine.getFormulaString()).toEqual("12");

        });
      });
    });
   
    
    describe("when the formula references another cell", () => {
      it("should return the value of the other cell", () => {
        const machine = new Machine(5,5);

        machine.setCurrentCellByLabel("B1");
        machine.addToken("22");
        expect(machine.getFormulaString()).toEqual("22");

        machine.setCurrentCellByLabel("A1");
        machine.addToken("B1");

        expect(machine.getFormulaString()).toEqual("B1");
        expect(machine.getResultString()).toEqual("22");
      });
    });

    describe("when the token B3 is entered and the current cell is A1 and B3 is empty", () => {
      it("should return an 0 string", () => {
        const machine = new Machine(5,5);

        machine.setCurrentCellByLabel("A1"); 
        machine.addToken("B3");
        expect(machine.getFormulaString()).toEqual("B3");
        expect(machine.getResultString()).toEqual(ErrorMessages.invalidCell);
      });
    });

    // Simulate a set of entries into the spreadsheet.
    // A1 = 1
    // B1 = A1 + 1
    // C1 = B1 + 1
    // D1 = C1 + 1

    describe("when the formula references another cell long formula", () => {
      it("should return the value of the other cell", () => {
        const machine = new Machine(5,5);

        machine.setCurrentCellByLabel("A1");
        machine.addToken("1");

        machine.setCurrentCellByLabel("B1");
        machine.addToken("A1");
        machine.addToken("+");
        machine.addToken("1");

        machine.setCurrentCellByLabel("C1");
        machine.addToken("B1");
        machine.addToken("+");
        machine.addToken("1");

        machine.setCurrentCellByLabel("D1");
        machine.addToken("C1");
        machine.addToken("+");
        machine.addToken("1");

        expect(machine.getFormulaString()).toEqual("C1 + 1");
        expect(machine.getResultString()).toEqual("4");
      });
    });
  });
});



