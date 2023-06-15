import SheetMemory from "../../Engine/SheetMemory";
import { Cell } from "../../Engine/Cell";

describe('SheetMemory', () => {
  describe('constructor', () => {
    describe('when the sheet memory is created', () => {
      describe('when the max rows and columns are not set', () => {
        it('getMaxRows should return 5, and getMaxColumns should return 5', () => {
          const sheetMemory = new SheetMemory(5, 5);
          const testMaxRows = sheetMemory.getMaxRows();
          const testMaxColumns = sheetMemory.getMaxColumns();
          expect(testMaxRows).toEqual(5);
          expect(testMaxColumns).toEqual(5);
        });
      });
      describe('when the max rows and columns are set', () => {
        it('getMaxRows should return 8, and getMaxColumns should return 7', () => {
          const testMaxRows = 8;
          const testMaxColumns = 7;
          const sheetMemory = new SheetMemory(testMaxColumns, testMaxRows);
          const testSetMaxRows = sheetMemory.getMaxRows();
          const testSetMaxColumns = sheetMemory.getMaxColumns();
          expect(testSetMaxRows).toEqual(testMaxRows);
          expect(testSetMaxColumns).toEqual(testMaxColumns);
        });
      });
    });
  });

  describe("getCellByLabel", () => {
    it("should return the cell", () => {
      const sheetMemory = new SheetMemory(10, 10);
      sheetMemory.setCurrentCellCoordinates(1, 1);
      let testWriteCell = new Cell();
      testWriteCell.setFormula(["1234"]);
      testWriteCell.setDisplayString("1234");
      testWriteCell.setValue(123);
      testWriteCell.setDependsOn(["A5"]);
      sheetMemory.setCurrentCell(testWriteCell);
      const testCell = sheetMemory.getCellByLabel("B2");
      expect(testCell.getDisplayString()).toEqual("1234");
      expect(testCell.getValue()).toEqual(123);
      expect(testCell.getFormula()).toEqual(["1234"]);
      expect(testCell.getDependsOn()).toEqual(["A5"]);
    });
  });

  describe('setCurrentCellCoordinates', () => {
    describe('when the current cell coordinates are set', () => {
      it('getCurrentCellCoordinates shoul return the same values', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testRow = 0;
        const testColumn = 0;
        sheetMemory.setCurrentCellCoordinates(testRow, testColumn);
        const testSetCoordinates = sheetMemory.getCurrentCellCoordinates();
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
        const testCoordinates = sheetMemory.getCurrentCellCoordinates();
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
        testCell.setDisplayString("1");
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
        const testCell = new Cell();
        const testGetCell = sheetMemory.getCurrentCell();
        expect(testGetCell).toEqual(testCell);
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
  describe('setCurrentCellDisplayString', () => {
    describe('when the current cell display string is set', () => {
      it('getCurrentCell should return the same cell', () => {
        const sheetMemory = new SheetMemory(5, 5);
        const testDisplayString = "1";
        sheetMemory.setCurrentCellDisplayString(testDisplayString);
        const testSetDisplayString = sheetMemory.getCurrentCell();
        expect(testSetDisplayString.getDisplayString()).toEqual(testDisplayString);
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
  describe('setSheetFormulas', () => {
    describe('when the sheet formulas are set', () => {
      it('getSheetFormulas should return the same formulas', () => {
        const sheetMemory = new SheetMemory(2, 2);
        // define testFormulas to be a 2 b 2 array of formulas

        const testFormulas: FormulaType[][] = [[["1", "+", "3"], ["2"]], [["3"], ["4"]]];
        sheetMemory.setSheetFormulas(testFormulas);
        const testSetFormulas = sheetMemory.getSheetFormulas();
        expect(testSetFormulas).toEqual(testFormulas);
      }
      );
    });
  });
}

);


