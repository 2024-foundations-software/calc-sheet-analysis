import SpreadSheetController from "../../Engine/SpreadSheetController";

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
        const machine = new SpreadSheetController(5, 5);
        machine.addToken("1");

        expect(machine.getFormulaString()).toEqual("1");
        expect(machine.getResultString()).toEqual("1");
      });
    });

    describe("when A1 refers to A2 and A2 refers to A3", () => {
      it("should return #REF! for A1", () => {
        const machine = new SpreadSheetController(5, 5);
        machine.setWorkingCellByLabel("A1");
        machine.addCell("A2");
        machine.setWorkingCellByLabel("A2");
        machine.addCell("A3");
        machine.setWorkingCellByLabel("A3");
        machine.setWorkingCellByLabel("A1");

        expect(machine.getFormulaString()).toEqual("A2");
        expect(machine.getResultString()).toEqual(ErrorMessages.invalidCell);
      });
    });

    describe("when the formula is not empty", () => {
      it("should add the token to the formula", () => {
        const machine = new SpreadSheetController(5, 5);
        machine.addToken("1");
        machine.addToken("+");
        machine.addToken("2");
        expect(machine.getFormulaString()).toEqual("1 + 2");
        expect(machine.getResultString()).toEqual("3");
      });
    });

    describe("When the value in A1 is set to B2", () => {
      describe("and the value of B2 is undefined", () => {
        it("the value of the display string of A1 should be #REF!", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("A1");
          machine.addCell("B2");
          expect(machine.getFormulaString()).toEqual("B2");
          expect(machine.getResultString()).toEqual(ErrorMessages.invalidCell);
        });
      });

      describe("it can have a forumula A2 + A2", () => {
        it("The value of the formula should be A2 +A2", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("A1");
          machine.addCell("A2");
          machine.addToken("+");
          machine.addCell("A2");
          expect(machine.getFormulaString()).toEqual("A2 + A2");
          expect(machine.getResultString()).toEqual(ErrorMessages.invalidCell);
          machine.setWorkingCellByLabel("A2");
          machine.addToken("1");
          expect(machine.getFormulaString()).toEqual("1");
          expect(machine.getResultString()).toEqual("1");
          machine.setWorkingCellByLabel("A1");
          expect(machine.getFormulaString()).toEqual("A2 + A2");
          expect(machine.getResultString()).toEqual("2");

        });
      });

      describe("and the value of A2 is defined", () => {
        it("the value of the display string of A1 should be the value of A2", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("A1");
          machine.addCell("A2");
          machine.setWorkingCellByLabel("A2");
          machine.addToken("1");
          machine.setWorkingCellByLabel("A1");
          expect(machine.getFormulaString()).toEqual("A2");
          expect(machine.getResultString()).toEqual("1");
        });
      });

      describe("when the sheet is empty and the current cell is A1", () => {
        it("attempting to add A1 to the formula should result in an empty formula", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("A1");
          machine.addCell("A1");
          expect(machine.getFormulaString()).toEqual("");
          expect(machine.getResultString()).toEqual("");
        });
      });

      describe("and the value of B2 is definedt then", () => {
        it("the value of the display string of 2 should be the value of B2", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("A1");
          machine.addCell("B2");
          machine.setWorkingCellByLabel("B2");
          machine.addToken("1");


          expect(machine.getFormulaString()).toEqual("1");
          expect(machine.getResultString()).toEqual("1");
        });
      });
    });

    /**
     * test the updateCurrentFormula method
     */


    describe("When the updateCurrentFormula method is used to set the current cell to B2", () => {
      describe("and a token 1 is added to the machine", () => {
        it("the value of the display string of B2 should be 1", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("A2");
          machine.addToken("1");
          expect(machine.getFormulaString()).toEqual("1");
          expect(machine.getResultString()).toEqual("1");
          let sheetValues: Array<Array<string>> = machine.getSheetDisplayStringsForGUI();
          expect(sheetValues[1][0]).toEqual("1");
        });
      });
    });




    describe("when the currentCellCoordinates change", () => {
      describe("And you then change the coordinates back", () => {
        it("should result in the same formula being in the tokenProcessor", () => {
          const machine = new SpreadSheetController(5, 5);
          machine.setWorkingCellByLabel("B1");
          machine.addToken("1");
          machine.addToken("+");
          machine.addToken("2");

          machine.setWorkingCellByLabel("A1");
          machine.addToken("1");
          machine.addToken("2");
          machine.setWorkingCellByLabel("B1");

          expect(machine.getFormulaString()).toEqual("1 + 2");

          machine.setWorkingCellByLabel("A1");
          expect(machine.getFormulaString()).toEqual("12");

        });
      });
    });


    describe("when the formula references another cell", () => {
      it("should return the value of the other cell", () => {
        const machine = new SpreadSheetController(5, 5);

        machine.setWorkingCellByLabel("B1");
        machine.addToken("22");
        expect(machine.getFormulaString()).toEqual("22");

        machine.setWorkingCellByLabel("A1");
        machine.addToken("B1");

        expect(machine.getFormulaString()).toEqual("B1");
        expect(machine.getResultString()).toEqual("22");
      });
    });

    describe("when the token B3 is entered and the current cell is A1 and B3 is empty", () => {
      it("should return an 0 string", () => {
        const machine = new SpreadSheetController(5, 5);

        machine.setWorkingCellByLabel("A1");
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
        const machine = new SpreadSheetController(5, 5);

        machine.setWorkingCellByLabel("A1");
        machine.addToken("1");

        machine.setWorkingCellByLabel("B1");
        machine.addToken("A1");
        machine.addToken("+");
        machine.addToken("1");

        machine.setWorkingCellByLabel("C1");
        machine.addToken("B1");
        machine.addToken("+");
        machine.addToken("1");

        machine.setWorkingCellByLabel("D1");
        machine.addToken("C1");
        machine.addToken("+");
        machine.addToken("1");

        expect(machine.getFormulaString()).toEqual("C1 + 1");
        expect(machine.getResultString()).toEqual("4");
      });
    });
  });

  describe("getSheetDisplayStringsForGUI when the original sheet is 2 columns and 4 rows", () => {
    it("should return the sheet display strings as an arrya of 4 rows and two columns", () => {
      const machine = new SpreadSheetController(2, 4);
      let sheetValues: Array<Array<string>> = machine.getSheetDisplayStringsForGUI();
      expect(sheetValues.length).toEqual(4);
      expect(sheetValues[0].length).toEqual(2);
    }
    );

  });

});



