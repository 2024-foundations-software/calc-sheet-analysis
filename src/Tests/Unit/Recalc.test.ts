// Unit tests for Recalc.ts
//
// Path: src/Tests/Unit/Recalc.test.ts
// Compare this snippet from src/Engine/Recalc.ts:
//
// // Recalc.ts
// export class Recalc {
//   private machine: Machine;
//   private errorOccured: boolean = false;

import { Recalc } from "../../Engine/Recalc";
import SheetMemory from "../../Engine/SheetMemory";
import Cell from "../../Engine/Cell";


let testMemory: SheetMemory;


beforeAll(() => {
  testMemory = new SheetMemory(5, 5);

  const cellA1 = new Cell();
  cellA1.setFormula(["1"]);
  cellA1.setValue(1);
  cellA1.setDisplayString("1");
  testMemory.setCurrentCellCoordinates(0, 0);
  testMemory.setCurrentCell(cellA1);

  const cellA2 = new Cell();
  cellA2.setFormula(["2"]);
  cellA2.setValue(2);
  cellA2.setDisplayString("2");
  testMemory.setCurrentCellCoordinates(0, 1);
  testMemory.setCurrentCell(cellA2);

  const cellA3 = new Cell();
  cellA3.setFormula(["3"]);
  cellA3.setValue(3);
  cellA3.setDisplayString("3");
  testMemory.setCurrentCellCoordinates(0, 2);
  testMemory.setCurrentCell(cellA3);


});

describe("Recalc", () => {
  describe("update", () => {
    describe("when the contains a single number", () => {
      it("returns the number", () => {
        const recalc = new Recalc();
        const formula: FormulaType = ["1"];
        const memory = new SheetMemory(5, 5);
        const [, result] = recalc.evaluate(formula, memory);

        expect(result).toEqual("1");
      }
      );
    }
    );
    describe("when the formula contains two tokens, number, operator", () => {
      it("returns the number", () => {
        const recalc = new Recalc();
        const formula: FormulaType = ["1", "+"];
        const memory = new SheetMemory(5, 5);
        const [, result] = recalc.evaluate(formula, memory);

        expect(result).toEqual("1");
      }
      );
    }
    );
    describe("when the formula contains three tokens, number, operator, number", () => {
      describe("when the operator is +", () => {
        it("returns the sum of the numbers", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "+", "2"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("3");
        }
        );
      }
      );
      describe("when the operator is -", () => {
        it("returns the difference of the numbers", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "-", "2"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("-1");
        }
        );
      }
      );
      describe("when the operator is *", () => {
        it("returns the product of the numbers", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "*", "2"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("2");
        }
        );
      }
      );
      describe("when the operator is /", () => {
        describe("when the divisor is not zero", () => {
          it("returns the quotient of the numbers", () => {
            const recalc = new Recalc();
            const formula: FormulaType = ["1", "/", "2"];
            const memory = new SheetMemory(5, 5);
            const [, result] = recalc.evaluate(formula, memory);

            expect(result).toEqual("0.5");
          }
          );
        }
        );

        describe("when the divisor is zero", () => {
          it("returns an error", () => {
            const recalc = new Recalc();
            const formula: FormulaType = ["1", "/", "0"];
            const memory = new SheetMemory(5, 5);
            const [, result] = recalc.evaluate(formula, memory);

            expect(result).toEqual("#DIV/0!");
          }
          );
        }
        );
      }
      );
    }
    );
    describe("when the formula contains five tokens, number, operator, number, operator, number", () => {
      describe("when the operators are +, +", () => {
        it("returns the sum of all three numbers", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "+", "2", "+", "3"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("6");
        }
        );
      }
      );

      describe("when the operators are +, -", () => {
        it("returns the sum of the first two numbers minus the third number", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "+", "2", "-", "3"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("0");
        }
        );
      }
      );
      describe("when the operators are +, *", () => {
        it("returns the product of the second and third number added to the first number", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "+", "2", "*", "3"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("7");

        }
        );
      }
      );
      describe("when the operators are +, /", () => {
        it("returns the quotient of the second and third number added to the first number", () => {
          const recalc = new Recalc();
          const formula: FormulaType = ["1", "+", "10", "/", "5"];
          const memory = new SheetMemory(5, 5);
          const [, result] = recalc.evaluate(formula, memory);

          expect(result).toEqual("3");

        }
        );
      }
      );
    }
    );
    describe("when the formula contains four tokens, number, operator, number, operator", () => {
      it("returns the result of the first three tokens", () => {
        const recalc = new Recalc();
        const formula: FormulaType = ["1", "+", "2", "+"];
        const memory = new SheetMemory(5, 5);
        const [, result] = recalc.evaluate(formula, memory);

        expect(result).toEqual("3");
      }
      );
    }
    );
    describe("when the formula A1 + A1", () => {

      it("returns the number", () => {
        const recalc = new Recalc();

        const evaluateFormula = ["A1", "+", "A1"];

        const [numValue, displayString] = recalc.evaluate(evaluateFormula, testMemory);
        expect(numValue).toEqual(2);
        expect(displayString).toEqual("2");
      });
    });

    describe("when the formula A1 + A2", () => {

      it("returns the number", () => {
        const recalc = new Recalc();

        const evaluateFormula = ["A1", "+", "A2"];

        const [numValue, displayString] = recalc.evaluate(evaluateFormula, testMemory);
        expect(numValue).toEqual(3);
        expect(displayString).toEqual("3");
      });
    });
    describe("when the formula A1 + A2 + 50", () => {

      it("returns the number", () => {
        const recalc = new Recalc();

        const evaluateFormula = ["A1", "+", "A2", "+", "50"];

        const [numValue, displayString] = recalc.evaluate(evaluateFormula, testMemory);
        expect(numValue).toEqual(53);
        expect(displayString).toEqual("53");
      });
    });

  }
  );
}
);
