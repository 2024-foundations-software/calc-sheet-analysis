// Unit tests for Recalc.ts
//
// Path: src/Tests/Unit/Recalc.test.ts
// Compare this snippet from src/Engine/Recalc.ts:
//
// // Recalc.ts
// export class Recalc {
//   private machine: Machine;


import FormulaEvaluator from "../../Engine/NewFormulaEvaluator";
import SheetMemory from "../../Engine/SheetMemory";
import Cell from "../../Engine/Cell";
import { ErrorMessages } from "../../Engine/GlobalDefinitions";


let testMemory: SheetMemory;
let recalc: FormulaEvaluator;


beforeEach(() => {
    testMemory = new SheetMemory(5, 5);
    recalc = new FormulaEvaluator(testMemory);


    const cellA1 = new Cell();
    cellA1.setFormula(["1"]);
    cellA1.setValue(1);
    cellA1.setError("");
    testMemory.setWorkingCellByCoordinates(0, 0);
    testMemory.setCurrentCell(cellA1);

    const cellA2 = new Cell();
    cellA2.setFormula(["2"]);
    cellA2.setValue(2);
    cellA2.setError("");
    testMemory.setWorkingCellByCoordinates(0, 1);
    testMemory.setCurrentCell(cellA2);

    const cellA3 = new Cell();
    cellA3.setFormula(["3"]);
    cellA3.setValue(3);
    cellA3.setError("");
    testMemory.setWorkingCellByCoordinates(0, 2);
    testMemory.setCurrentCell(cellA3);
});

describe("FormulaEvaluator", () => {
    describe("update", () => {
        describe("when the contains a single number", () => {
            it("returns the number", () => {
                const formula: FormulaType = ["1"];
                const memory = new SheetMemory(5, 5);

                recalc.evaluate(formula)
                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(1);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is ( 8 )", () => {
            it("returns the number", () => {
                const formula: FormulaType = ["(", "8", ")"];
                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(8);
                expect(error).toEqual("");
            });
        });


        describe("when the formula contains two tokens, number, operator", () => {
            it("returns the number", () => {
                const formula: FormulaType = ["1", "+"];

                recalc.evaluate(formula);
                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(1);
                expect(error).toEqual(ErrorMessages.invalidFormula);
            });
        });

        describe("when the formula contains three tokens, number, operator, number", () => {
            describe("when the operator is +", () => {
                it("returns the sum of the numbers", () => {
                    const formula: FormulaType = ["1", "+", "2"];
                    const memory = new SheetMemory(5, 5);
                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;

                    expect(result).toEqual(3);
                    expect(error).toEqual("");
                });
            });

            describe("when the operator is -", () => {
                it("returns the difference of the numbers", () => {
                    const formula: FormulaType = ["1", "-", "2"];
                    const memory = new SheetMemory(5, 5);
                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;

                    expect(result).toEqual(-1);
                    expect(error).toEqual("");
                });
            });



            describe("when the operator is *", () => {
                it("returns the product of the numbers", () => {
                    const formula: FormulaType = ["1", "*", "2"];
                    const memory = new SheetMemory(5, 5);
                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;

                    expect(result).toEqual(2);
                    expect(error).toEqual("");
                });
            });


            describe("when the operator is /", () => {
                describe("when the divisor is not zero", () => {
                    it("returns the quotient of the numbers", () => {
                        const formula: FormulaType = ["1", "/", "2"];

                        recalc.evaluate(formula);

                        let result = recalc.result;
                        let error = recalc.error;

                        expect(result).toEqual(0.5);
                        expect(error).toEqual("");
                    });
                });

                describe("when the divisor is zero", () => {
                    it("returns an error", () => {
                        const formula: FormulaType = ["1", "/", "0"];

                        recalc.evaluate(formula);

                        let result = recalc.result;
                        let error = recalc.error;

                        expect(result).toEqual(Infinity);
                        expect(error).toEqual("#DIV/0!");
                    });
                });
            });
        });

        describe(" The formula is ( )", () => {
            it("returns a syntax error", () => {
                const formula: FormulaType = ["(", ")"];
                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(0);
                expect(error).toEqual(ErrorMessages.missingParentheses);
            });
        });

        describe("when the formula contains 8 ( ", () => {
            it("returns a syntax error", () => {
                const formula: FormulaType = ["8", "("];
                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;


                expect(result).toEqual(8);
                expect(error).toEqual(ErrorMessages.invalidFormula);
            });
        });

        describe("when the formula contains five tokens, number, operator, number, operator, number", () => {
            describe("when the operators are +, +", () => {
                it("returns the sum of all three numbers", () => {
                    const formula: FormulaType = ["1", "+", "2", "+", "3"];

                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;
                    expect(result).toEqual(6);
                    expect(error).toEqual("");
                });
            });

            describe("when the operators are +, -", () => {
                it("returns the sum of the first two numbers minus the third number", () => {
                    const formula: FormulaType = ["1", "+", "2", "-", "3"];
                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;

                    expect(result).toEqual(0);
                    expect(error).toEqual("");
                });
            });

            describe("when the operators are +, *", () => {
                it("returns the product of the second and third number added to the first number", () => {
                    const formula: FormulaType = ["1", "+", "2", "*", "3"];
                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;

                    expect(result).toEqual(7);
                    expect(error).toEqual("");

                });
            });


            describe("when the operators are +, /", () => {
                it("returns the quotient of the second and third number added to the first number", () => {

                    const formula: FormulaType = ["1", "+", "10", "/", "5"];
                    recalc.evaluate(formula);

                    let result = recalc.result;
                    let error = recalc.error;

                    expect(result).toEqual(3);
                    expect(error).toEqual("");

                });
            });
        });

        describe("when the formula contains four tokens, number, operator, number, operator", () => {
            it("returns the result of the first three tokens", () => {
                const formula: FormulaType = ["1", "+", "2", "+"];
                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(3);
                expect(error).toEqual(ErrorMessages.invalidFormula);
            }
            );
        }
        );
        describe("when the formula A1 + A1", () => {

            it("returns the number", () => {
                const formula = ["A1", "+", "A1"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;
                expect(result).toEqual(2);
                expect(error).toEqual("");
            });
        });

        describe("when the formula A1 + A2", () => {
            it("returns the number", () => {
                const formula = ["A1", "+", "A2"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(3);
                expect(error).toEqual("");

            });
        });

        describe("when the formula A1 + A2 + 50", () => {

            it("returns the number", () => {


                const formula = ["A1", "+", "A2", "+", "50"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(53);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 1 * ) ", () => {
            it("returns the number", () => {
                const formula = ["1", "+", "+"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(1);
                expect(error).toEqual(ErrorMessages.invalidFormula);
            });
        });

        describe("when the formula is - 1", () => {
            it("returns the number -1", () => {
                const formula = ["-", "1"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(-1);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 1 '+/-' ", () => {
            it("returns the number", () => {
                const formula = ["1", "+/-"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(-1);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 3.14159265358979323  cos' ", () => {
            it("returns the numbe 0", () => {
                const formula = ["3.14159265358979323", "cos"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(-1);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 3.14159265358979323  sin' ", () => {
            it("returns the numbe 0", () => {
                const formula = ["3.14159265358979323", "sin"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(Math.abs(result)).toBeLessThan(0.000000000000001);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is (3.14159265358979323 / 4)  tan' ", () => {
            it("returns the numbe 0", () => {
                const formula = ["(", "3.14159265358979323", "/", "4", ")", "tan"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;
                let delta = Math.abs(result - 1);
                expect(delta).toBeLessThan(0.000000000000001);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 1  asin' ", () => {
            it("returns the number PI/2", () => {
                const formula = ["1", "asin"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(1.5707963267948966);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 1  acos' ", () => {
            it("returns the numbe 0", () => {
                const formula = ["1", "acos"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(0);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 1  atan' ", () => {
            it("returns the number PI/4", () => {
                const formula = ["1", "atan"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(0.7853981633974483);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 4  sqrt' ", () => {
            it("returns the number 2", () => {
                const formula = ["4", "sqrt"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(2);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 8  cuberoot' ", () => {
            it("returns the number 2", () => {
                const formula = ["8", "cuberoot"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(2);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 4  sqr' ", () => {
            it("returns the number 16", () => {
                const formula = ["4", "sqr"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(16);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 4  cube' ", () => {
            it("returns the number 64", () => {
                const formula = ["4", "cube"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(64);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 4  1/x' ", () => {
            it("returns the number 0.25", () => {
                const formula = ["4", "1/x"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(0.25);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 2  1/x sqr 1/x' ", () => {
            it("returns the number 0.25", () => {
                const formula = ["2", "1/x", "sqr", "1/x"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(4);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is ( 1 + 1 ) sqr sqr sqr' ", () => {
            it("returns the number 0.25", () => {
                const formula = ["(", "1", "+", "1", ")", "sqr", "sqr", "sqr"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(256);
                expect(error).toEqual("");
            });
        });

        describe("when the formula is 2 sqr sqr sqr ) ", () => {
            it("returns the number", () => {
                const formula = ["2", "sqr", "sqr", "sqr", ")"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(256);
                expect(error).toEqual(ErrorMessages.invalidFormula);
            });
        });

        describe("when the formula is 0 1/x ) ", () => {
            it("returns the number", () => {
                const formula = ["0", "1/x", ")"];

                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;

                expect(result).toEqual(Infinity);
                expect(error).toEqual("#DIV/0!");
            });
        });

        describe("when the formula is rand", () => {
            it("returns a random number", () => {
                const formula = ["rand"];
                recalc.evaluate(formula);

                let result = recalc.result;
                let error = recalc.error;


                expect(error).toEqual("");
            });
        });




    });
});
