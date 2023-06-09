/**
 * @jest-environment jsdom
 
 */
import { Cell } from "../../Engine/Cell";

describe("Cell", () => {
  describe("constructor", () => {
    it("should create an empty cell", () => {
      const cell = new Cell();
      expect(cell.getFormula()).toEqual([]);
      expect(cell.getValue()).toEqual(0);
      expect(cell.getDisplayString()).toEqual("");
      expect(cell.getDependsOn()).toEqual([]);
    });
  }
  );
  describe("copy constructor", () => {
    it("should copy the cell", () => {
      const cell = new Cell();
      cell.setFormula(["1", "+", "2"]);
      cell.setValue(3);
      cell.setDisplayString("3");
      cell.setDependsOn(["A1"]);
      const cellCopy = new Cell(cell);
      expect(cellCopy.getFormula()).toEqual(["1", "+", "2"]);
      expect(cellCopy.getValue()).toEqual(3);
      expect(cellCopy.getDisplayString()).toEqual("3");
      expect(cellCopy.getDependsOn()).toEqual(["A1"]);
    });
  }
  );
  describe("getFormula", () => {
    it("should return the formula", () => {
      const cell = new Cell();
      expect(cell.getFormula()).toEqual([]);
    });
  }
  );
  
  describe("setFormula", () => {
    it("should set the formula", () => {
      const cell = new Cell();
      const formula = ["1", "+", "2"];
      cell.setFormula(formula);
      expect(cell.getFormula()).toEqual(formula);
    });
  }
  );
  describe("getValue", () => {
    it("should return the value", () => {
      const cell = new Cell();
      expect(cell.getValue()).toEqual(0);
    });
  }
  );
  describe("setValue", () => {
    it("should set the value", () => {
      const cell = new Cell();
      cell.setValue(1);
      expect(cell.getValue()).toEqual(1);
    });
  }
  );
  describe("getDisplayString", () => {
    it("should return the display string", () => {
      const cell = new Cell();
      expect(cell.getDisplayString()).toEqual("");
    });
  }
  );
  describe("setDisplayString", () => {
    it("should set the display string", () => {
      const cell = new Cell();
      cell.setDisplayString("1");
      expect(cell.getDisplayString()).toEqual("1");
    });
  }
  );
 
}
);



