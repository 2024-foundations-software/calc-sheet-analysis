import SheetMemory from "../../Engine/SheetMemory";
import { Cell } from "../../Engine/Cell";

describe('SheetMemory', () => {
  describe('constructor', () => {
    describe('when the sheet memory is created', () => {
      describe('when the max rows and columns are not set', () => {
        it('getMaxRows should return 5, and getMaxColumns should return 5', () => {
          const sheetMemory = new SheetMemory(5, 5);
          const testMaxRows = sheetMemory.getNumRows();
          const testMaxColumns = sheetMemory.getNumColumns();
          expect(testMaxRows).toEqual(5);
          expect(testMaxColumns).toEqual(5);
        });
      });

      describe('cells should have labels that are column row pairs', () => {
        it('should have the correct labels', () => {
          const sheetMemory = new SheetMemory(5, 5);
          const testGetCell = sheetMemory.getCellByLabel("A1");
          expect(testGetCell.getLabel()).toEqual("A1");
        });
      });

      describe('when the max rows and columns are set', () => {
        it('getMaxRows should return 8, and getMaxColumns should return 7', () => {
          const testMaxRows = 8;
          const testMaxColumns = 7;
          const sheetMemory = new SheetMemory(testMaxColumns, testMaxRows);
          const testSetMaxRows = sheetMemory.getNumRows();
          const testSetMaxColumns = sheetMemory.getNumColumns();
          expect(testSetMaxRows).toEqual(testMaxRows);
          expect(testSetMaxColumns).toEqual(testMaxColumns);
        });
      });
    });
  });

  describe("getCellByLabel", () => {
    it("should return the cell", () => {
      const sheetMemory = new SheetMemory(10, 10);
      sheetMemory.setWorkingCellByCoordinates(1, 1);
      let testWriteCell = new Cell();
      testWriteCell.setFormula(["123"]);
      testWriteCell.setError("");
      testWriteCell.setValue(123);
      testWriteCell.setDependsOn(["A5"]);
      testWriteCell.setLabel("B2");
      sheetMemory.setCurrentCell(testWriteCell);
      const testCell = sheetMemory.getCellByLabel("B2");
      expect(testCell.getLabel()).toEqual("B2");
      expect(testCell.getDisplayString()).toEqual("123");
      expect(testCell.getValue()).toEqual(123);
      expect(testCell.getFormula()).toEqual(["123"]);
      expect(testCell.getDependsOn()).toEqual(["A5"]);
    });
  });

  describe('setCurrentCellCoordinates', () => {
    describe('when the current cell coordinates are set', () => {
      it('getCurrentCellCoordinates shoul return the same values', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testRow = 0;
        const testColumn = 0;
        sheetMemory.setWorkingCellByCoordinates(testRow, testColumn);
        const testSetCoordinates = sheetMemory.getWorkingCellByCoordinates();
        expect(testSetCoordinates).toEqual([testRow, testColumn]);
      }
      );
    });

  }
  );
  describe('getCurrentCellCoordinates', () => {
    describe('when the current cell coordinates are not set', () => {
      it('getCurrentCellCoordinates should return [0, 0]', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testCoordinates = sheetMemory.getWorkingCellByCoordinates();
        expect(testCoordinates).toEqual([0, 0]);
      }
      );
    });
  }
  );
  describe('setCurrentCell', () => {
    describe('when the current cell is set', () => {
      it('getCurrentCell should return the same cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testCell = new Cell();
        testCell.setFormula(["1"]);
        testCell.setError("");
        testCell.setValue(1);
        testCell.setDependsOn([]);
        sheetMemory.setCurrentCell(testCell);
        const testSetCell = sheetMemory.getCurrentCell();
        expect(testSetCell.getDisplayString()).toEqual("1");
        expect(testSetCell.getValue()).toEqual(1);
        expect(testSetCell.getFormula()).toEqual(["1"]);
        expect(testSetCell.getDependsOn()).toEqual([]);

      }
      );
    });
  }
  );
  describe('getCurrentCell', () => {
    describe('when the current cell is not set', () => {
      it('getCurrentCell should return the default cell', () => {
        const sheetMemory = new SheetMemory(5, 5);

        const testGetCell = sheetMemory.getCurrentCell();
        expect(testGetCell.getLabel()).toEqual("A1");
      }
      );
    });
  }
  );
  describe('setCurrentCellFormula', () => {
    describe('when the current cell formula is set', () => {
      it('getCurrentCell should return the same cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testFormula = ["1"];
        sheetMemory.setCurrentCellFormula(testFormula);
        const testSetFormula = sheetMemory.getCurrentCell();
        expect(testSetFormula.getFormula()).toEqual(testFormula);
      }
      );
    });
  }
  );
  describe('getCurrentCellFormula', () => {
    describe('when the current cell formula is not set', () => {
      it('getCurrentCell should return the default cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testFormula: FormulaType = [];
        const testGetFormula = sheetMemory.getCurrentCell();
        expect(testGetFormula.getFormula()).toEqual(testFormula);
      }
      );
    });
  }
  );
  describe('setCurrentCellValue', () => {
    describe('when the current cell value is set', () => {
      it('getCurrentCell should return the same cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testValue = 1;
        sheetMemory.setCurrentCellValue(testValue);
        const testSetValue = sheetMemory.getCurrentCell();
        expect(testSetValue.getValue()).toEqual(testValue);
      }
      );
    });
  }
  );
  describe('getCurrentCellValue', () => {
    describe('when the current cell value is not set', () => {
      it('getCurrentCell should return the default cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testValue = 0;
        const testGetValue = sheetMemory.getCurrentCell();
        expect(testGetValue.getValue()).toEqual(testValue);
      }
      );
    });
  }
  );

  describe('getCurrentCellDisplayString', () => {
    describe('when the current cell display string is not set', () => {
      it('getCurrentCell should return the default cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testDisplayString = "";
        const testGetDisplayString = sheetMemory.getCurrentCell();
        expect(testGetDisplayString.getDisplayString()).toEqual(testDisplayString);
      }
      );
    });
  }
  );

});


