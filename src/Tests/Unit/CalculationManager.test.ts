/**
 * RecalcDependency.ts
 */
import CalculationManager from "../../Engine/CalculationManager";
import SheetMemory from "../../Engine/SheetMemory";
import Cell from "../../Engine/Cell";
import { get } from "http";
import e from "cors";

let testMemory: SheetMemory;
let calculationManager: CalculationManager;
beforeEach(() => {
  testMemory = new SheetMemory(3, 3);
  calculationManager = new CalculationManager();

  const cellA1 = new Cell();
  cellA1.setFormula(["A2"]);
  cellA1.setValue(1);
  cellA1.setError("");
  cellA1.setDependsOn(["A2"]);

  testMemory.setCurrentCellCoordinates(0, 0);
  testMemory.setCurrentCell(cellA1);


  const cellA2 = new Cell();
  cellA2.setFormula(["2"]);
  cellA2.setValue(2);
  cellA2.setError("");
  cellA2.setDependsOn([]);
  testMemory.setCurrentCellCoordinates(0, 1);
  testMemory.setCurrentCell(cellA2);

  const cellA3 = new Cell();
  cellA3.setFormula(["A1"]);
  cellA3.setValue(3);
  cellA3.setError("");
  cellA3.setDependsOn(["A1", "A2"]);
  testMemory.setCurrentCellCoordinates(0, 2);
  testMemory.setCurrentCell(cellA3);
}
);

describe("RecalcDependency", () => {

  describe("explandDependencies should detect a loop when a1 points at a2 and a2 points at a3 ", () => {
    it("The circular flag should be set to true", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let cellA1: Cell = new Cell();
      cellA1.setFormula(["A2"]);
      cellA1.setValue(0);
      cellA1.setError("");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(cellA1);
      let okToAdd = calculationManager.addCellDependency("A1", "A2", testMemory);

      expect(okToAdd).toEqual(true);
      let [isCircular, dependencies] = calculationManager.expandDependencies("A1", "A1", testMemory);
      expect(isCircular).toEqual(false);
      expect(dependencies).toEqual(["A2"]);

      let cellA2: Cell = new Cell();
      cellA2.setFormula(["A3"]);
      cellA2.setValue(0);
      cellA2.setError("");
      testMemory.setCurrentCellCoordinates(0, 1);
      testMemory.setCurrentCell(cellA2);
      okToAdd = calculationManager.addCellDependency("A2", "A3", testMemory);

      expect(okToAdd).toEqual(true);
      [isCircular, dependencies] = calculationManager.expandDependencies("A1", "A1", testMemory);
      expect(isCircular).toEqual(false);
      expect(dependencies).toEqual(["A3", "A2"]);

      let cellA3: Cell = new Cell();
      cellA3.setFormula([]);
      cellA3.setValue(0);
      cellA3.setError("");
      testMemory.setCurrentCellCoordinates(0, 2);
      testMemory.setCurrentCell(cellA3);
      okToAdd = calculationManager.addCellDependency("A3", "A1", testMemory);

      expect(okToAdd).toEqual(false);



    });
  });

  describe("WORKING updateComputationOrder", () => {
    it("should update the computationOrder to be in the correct order", () => {

      const computationOrder = calculationManager.updateComputationOrder(testMemory);
      let lastCell = computationOrder[computationOrder.length - 1];
      let penultimateCell = computationOrder[computationOrder.length - 2];

      expect(lastCell).toEqual("A3");
      expect(penultimateCell).toEqual("A1");
    });
  });






  describe("add two Dependency to cell", () => {
    it("should add the new dependency to the cell", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let testWriteCell: Cell = new Cell();
      testWriteCell.setFormula(["A2", "-", "A3"]);
      testWriteCell.setValue(0);
      testWriteCell.setError("");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(testWriteCell);

      const cellB1 = new Cell();
      cellB1.setFormula(["A1"]);
      testMemory.setCurrentCellCoordinates(1, 0);
      testMemory.setCurrentCell(cellB1);

      calculationManager.updateDependencies(testMemory);
      const B1DependsOn = testMemory.getCellByLabel("B1").getDependsOn();

      const foundFirstDependency = (B1DependsOn[0] === "A2" || B1DependsOn[0] === "A3");
      const foundSecondDependency = (B1DependsOn[1] === "A2" || B1DependsOn[1] === "A3") && B1DependsOn[1] !== B1DependsOn[0];
      const foundThirdDependency = B1DependsOn[2] === "A1";
      const satisfiedTest = foundFirstDependency && foundSecondDependency && foundThirdDependency;
      expect(satisfiedTest).toEqual(true);
      expect(B1DependsOn[2]).toEqual("A1");

    }
    );
  });

  describe("REVERSE add a chain A1 depends on A2, A2 depends on A3, A3 depends on A4", () => {
    it("should add the new dependency to the cell", () => {
      let testMemory: SheetMemory = new SheetMemory(5, 5);
      let A1Cell = new Cell();
      A1Cell.setFormula(["A2"]);
      A1Cell.setValue(0);
      A1Cell.setError("");

      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(A1Cell);
      let okToAdd = calculationManager.addCellDependency("A1", "A2", testMemory);
      expect(okToAdd).toEqual(true);

      let A2Cell = new Cell();
      A2Cell.setFormula(["A3"]);
      A2Cell.setValue(0);
      A2Cell.setError("");

      testMemory.setCurrentCellCoordinates(0, 1);
      testMemory.setCurrentCell(A2Cell);
      okToAdd = calculationManager.addCellDependency("A2", "A3", testMemory);
      expect(okToAdd).toEqual(true);



      let A3Cell = new Cell();
      A3Cell.setFormula(["A4"]);
      A3Cell.setValue(0);
      A3Cell.setError("");

      testMemory.setCurrentCellCoordinates(0, 2);
      testMemory.setCurrentCell(A3Cell);
      okToAdd = calculationManager.addCellDependency("A3", "A4", testMemory);
      expect(okToAdd).toEqual(true);

      let A4Cell = new Cell();
      A4Cell.setFormula(["4"]);
      A4Cell.setValue(4);
      A4Cell.setError("");

      testMemory.setCurrentCellCoordinates(0, 3);
      testMemory.setCurrentCell(A4Cell);
      calculationManager.updateDependencies(testMemory);

      let A1DependsOn = new Set(testMemory.getCellByLabel("A1").getDependsOn());
      let A2DependsOn = new Set(testMemory.getCellByLabel("A2").getDependsOn());
      let A3DependsOn = new Set(testMemory.getCellByLabel("A3").getDependsOn());

      expect(testMemory.getCellByLabel("A1").getDependsOn()).toEqual(["A4", "A3", "A2"]);
      expect(testMemory.getCellByLabel("A2").getDependsOn()).toEqual(["A4", "A3"]);
      expect(testMemory.getCellByLabel("A3").getDependsOn()).toEqual(["A4"]);
    }
    );
  });

  describe("attempting to add a circular dependency", () => {
    it("should return false", () => {
      let testMemory: SheetMemory = new SheetMemory(5, 5);
      let A1Cell = new Cell();
      A1Cell.setFormula(["B1", "+", "C1"]);
      A1Cell.setValue(0);
      A1Cell.setError("");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(A1Cell);

      // B1 is D1 + D2
      let B1Cell = new Cell();
      B1Cell.setFormula(["D1", "+", "D2"]);
      B1Cell.setValue(0);
      B1Cell.setError("");
      testMemory.setCurrentCellCoordinates(1, 0);
      testMemory.setCurrentCell(B1Cell);

      // C1 is A2 + A3
      let C1Cell = new Cell();
      C1Cell.setFormula(["A2", "+", "A3"]);
      C1Cell.setValue(0);
      C1Cell.setError("");
      testMemory.setCurrentCellCoordinates(2, 0);
      testMemory.setCurrentCell(C1Cell);

      // now we want to add a circular dependency by adding A1 to D1
      let calculationManager = new CalculationManager();
      calculationManager.updateDependencies(testMemory);

      let okToAdd = calculationManager.addCellDependency("D1", "A1", testMemory);
      expect(okToAdd).toEqual(false);
    });
  });




  describe("FORWARD add a chain A1 depends on A2, A2 depends on B1, B1 depends on B2", () => {
    it("should add the new dependency to the cell", () => {
      let testMemoryInt: SheetMemory = new SheetMemory(2, 2);
      let A1Cell = new Cell();
      A1Cell.setFormula(["A2"]);
      A1Cell.setValue(0);
      A1Cell.setError("");

      testMemoryInt.setCurrentCellCoordinates(0, 0);
      testMemoryInt.setCurrentCell(A1Cell);
      let okToAdd = calculationManager.addCellDependency("A1", "A2", testMemoryInt);
      expect(okToAdd).toEqual(true);

      let A2Cell = new Cell();
      A2Cell.setFormula(["B1"]);
      A2Cell.setValue(0);
      A2Cell.setError("");


      testMemoryInt.setCurrentCellCoordinates(0, 1);
      testMemoryInt.setCurrentCell(A2Cell);
      okToAdd = calculationManager.addCellDependency("A2", "B1", testMemoryInt);
      expect(okToAdd).toEqual(true);

      let B1Cell = new Cell();
      B1Cell.setFormula(["B2"]);
      B1Cell.setValue(0);
      B1Cell.setError("");


      testMemoryInt.setCurrentCellCoordinates(1, 0);
      testMemoryInt.setCurrentCell(B1Cell);
      okToAdd = calculationManager.addCellDependency("B1", "B2", testMemoryInt);
      expect(okToAdd).toEqual(true);

      let B2Cell = new Cell();
      B2Cell.setFormula(["2"]);
      B2Cell.setValue(2);
      B2Cell.setError("");


      calculationManager.updateDependencies(testMemoryInt);



      expect(testMemoryInt.getCellByLabel("A1").getDependsOn()).toEqual(["B2", "B1", "A2"]);
      expect(testMemoryInt.getCellByLabel("A2").getDependsOn()).toEqual(["B2", "B1"]);
      expect(testMemoryInt.getCellByLabel("B1").getDependsOn()).toEqual(["B2"]);

    });
  });
  describe("A 3 by 3 sheet with the first cell being a sum of all the other cells", () => {
    it("should result in a dependsOn array of all the other cells", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let cellA1: Cell = new Cell();
      cellA1.setFormula(["A2", "+", "A3", "+", "B1", "+", "B2", "+", "B3", "+", "C1", "+", "C2", "+", "C3"]);
      cellA1.setValue(0);
      cellA1.setError("");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(cellA1);



      calculationManager.updateDependencies(testMemory);
      const A1DependsOn = testMemory.getCellByLabel("A1").getDependsOn();
      let A1DependsOnSet = new Set(A1DependsOn);
      let expectedSet = new Set(["A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]);
      expect(A1DependsOnSet).toEqual(expectedSet);
    });
  });

  describe("A 3 by 3 sheet with all the cells (exept for the first one) to contain the formula A1", () => {
    it("should result in each other cell having A1 in their dependsOn array", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      let cellA1: Cell = new Cell();
      cellA1.setFormula([]);
      cellA1.setValue(0);
      cellA1.setError("");
      testMemory.setCurrentCellCoordinates(0, 0);
      testMemory.setCurrentCell(cellA1);

      let cellOther: Cell = new Cell();
      cellOther.setFormula(["A1"]);
      cellOther.setValue(0);
      cellOther.setError("");

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          testMemory.setCurrentCellCoordinates(i, j);
          testMemory.setCurrentCell(cellOther);
        }
      }
      calculationManager.updateDependencies(testMemory);

      const A1DependsOn = testMemory.getCellByLabel("A1").getDependsOn();
      expect(A1DependsOn).toEqual([]);

      const A2DependsOn = testMemory.getCellByLabel("A2").getDependsOn();
      expect(A2DependsOn).toEqual(["A1"]);

      const A3DependsOn = testMemory.getCellByLabel("A3").getDependsOn();
      expect(A3DependsOn).toEqual(["A1"]);

      const B1DependsOn = testMemory.getCellByLabel("B1").getDependsOn();
      expect(B1DependsOn).toEqual(["A1"]);

      const B2DependsOn = testMemory.getCellByLabel("B2").getDependsOn();
      expect(B2DependsOn).toEqual(["A1"]);

      const B3DependsOn = testMemory.getCellByLabel("B3").getDependsOn();
      expect(B3DependsOn).toEqual(["A1"]);

      const C1DependsOn = testMemory.getCellByLabel("C1").getDependsOn();
      expect(C1DependsOn).toEqual(["A1"]);

      const C2DependsOn = testMemory.getCellByLabel("C2").getDependsOn();
      expect(C2DependsOn).toEqual(["A1"]);

      const C3DependsOn = testMemory.getCellByLabel("C3").getDependsOn();
      expect(C3DependsOn).toEqual(["A1"]);

    });

    describe("A 3 by 3 sheet with all of the cells being in a chain in reverse order", () => {
      let testMemory: SheetMemory = new SheetMemory(3, 3);
      calculationManager = new CalculationManager();
      let cellC3: Cell = new Cell();
      cellC3.setFormula(["C2", "+", "1"]);
      testMemory.setCurrentCellLabel("C3");
      testMemory.setCurrentCell(cellC3);

      let cellC2: Cell = new Cell();
      cellC2.setFormula(["C1", "+", "1"]);
      testMemory.setCurrentCellLabel("C2");
      testMemory.setCurrentCell(cellC2);

      let cellC1: Cell = new Cell();
      cellC1.setFormula(["B3", "+", "1"]);
      testMemory.setCurrentCellLabel("C1");
      testMemory.setCurrentCell(cellC1);


      let cellB3: Cell = new Cell();
      cellB3.setFormula(["B2", "+", "1"]);
      testMemory.setCurrentCellLabel("B3");
      testMemory.setCurrentCell(cellB3);

      let cellB2: Cell = new Cell();
      cellB2.setFormula(["B1", "+", "1"]);
      testMemory.setCurrentCellLabel("B2");
      testMemory.setCurrentCell(cellB2);

      let cellB1: Cell = new Cell();
      cellB1.setFormula(["A3", "+", "1"]);
      testMemory.setCurrentCellLabel("B1");
      testMemory.setCurrentCell(cellB1);

      let cellA3: Cell = new Cell();
      cellA3.setFormula(["A2", "+", "1"]);
      testMemory.setCurrentCellLabel("A3");
      testMemory.setCurrentCell(cellA3);

      let cellA2: Cell = new Cell();
      cellA2.setFormula(["A1", "+", "1"]);
      testMemory.setCurrentCellLabel("A2");
      testMemory.setCurrentCell(cellA2);

      let cellA1: Cell = new Cell();
      cellA1.setFormula(["45"]);
      testMemory.setCurrentCellLabel("A1");
      testMemory.setCurrentCell(cellA1);

      calculationManager.updateDependencies(testMemory);
      calculationManager.updateComputationOrder(testMemory);

      let C3DependsOn = new Set(testMemory.getCellByLabel("C3").getDependsOn());
      let expectedSet = new Set(["C2", "C1", "B3", "B2", "B1", "A3", "A2", "A1"]);
      expect(C3DependsOn).toEqual(expectedSet);

      let C2DependsOn = new Set(testMemory.getCellByLabel("C2").getDependsOn());
      expectedSet = new Set(["C1", "B3", "B2", "B1", "A3", "A2", "A1"]);
      expect(C2DependsOn).toEqual(expectedSet);

      let C1DependsOn = new Set(testMemory.getCellByLabel("C1").getDependsOn());
      expectedSet = new Set(["B3", "B2", "B1", "A3", "A2", "A1"]);
      expect(C1DependsOn).toEqual(expectedSet);

      let B3DependsOn = new Set(testMemory.getCellByLabel("B3").getDependsOn());
      expectedSet = new Set(["B2", "B1", "A3", "A2", "A1"]);
      expect(B3DependsOn).toEqual(expectedSet);

      let B2DependsOn = new Set(testMemory.getCellByLabel("B2").getDependsOn());
      expectedSet = new Set(["B1", "A3", "A2", "A1"]);
      expect(B2DependsOn).toEqual(expectedSet);

      let B1DependsOn = new Set(testMemory.getCellByLabel("B1").getDependsOn());
      expectedSet = new Set(["A3", "A2", "A1"]);
      expect(B1DependsOn).toEqual(expectedSet);

      let A3DependsOn = new Set(testMemory.getCellByLabel("A3").getDependsOn());
      expectedSet = new Set(["A2", "A1"]);
      expect(A3DependsOn).toEqual(expectedSet);

      let A2DependsOn = new Set(testMemory.getCellByLabel("A2").getDependsOn());
      expectedSet = new Set(["A1"]);
      expect(A2DependsOn).toEqual(expectedSet);



      let expectedComputation = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
      let actualComputation = calculationManager.updateComputationOrder(testMemory);
      expect(actualComputation).toEqual(expectedComputation);

    });


  });


});

